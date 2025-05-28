// Middleware de cola simple para envío de emails en segundo plano
class EmailQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
    this.stats = {
      processed: 0,
      errors: 0,
      pending: 0
    };
  }

  // Agregar tarea a la cola
  addTask(emailData, callback) {
    const task = {
      id: Date.now() + Math.random(),
      data: emailData,
      callback: callback || (() => {}),
      timestamp: new Date(),
      status: 'pending'
    };

    this.queue.push(task);
    this.stats.pending++;
    
    console.log(`📬 Tarea agregada a la cola. ID: ${task.id}, Cola: ${this.queue.length} tareas`);
    
    // Procesar la cola si no se está procesando
    if (!this.processing) {
      this.processQueue();
    }

    return task.id;
  }

  // Procesar la cola
  async processQueue() {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;
    console.log(`🔄 Iniciando procesamiento de cola. ${this.queue.length} tareas pendientes`);

    while (this.queue.length > 0) {
      const task = this.queue.shift();
      this.stats.pending--;
      
      try {
        console.log(`⚡ Procesando tarea ID: ${task.id}`);
        task.status = 'processing';
        
        // Simular procesamiento (en caso real, aquí iría la lógica de envío)
        const result = await this.processEmailTask(task.data);
        
        task.status = 'completed';
        this.stats.processed++;
        
        console.log(`✅ Tarea completada ID: ${task.id}`);
        
        // Llamar callback si existe
        if (task.callback) {
          task.callback(null, result);
        }

        // Pequeña pausa entre tareas para no sobrecargar
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        task.status = 'failed';
        this.stats.errors++;
        
        console.error(`❌ Error en tarea ID: ${task.id}`, error);
        
        // Llamar callback con error
        if (task.callback) {
          task.callback(error, null);
        }
      }
    }

    this.processing = false;
    console.log(`🏁 Cola procesada. Estadísticas:`, this.stats);
  }

  // Procesar una tarea específica de email
  async processEmailTask(emailData) {
    console.log(`📧 Procesando envío de email:`, {
      destinatarios: emailData.selectedEmails?.length || 0,
      tipo: emailData.messageType,
      asunto: emailData.subject
    });

    try {
      // Importar y usar la función real de procesamiento
      const { processEmailSending } = require('../controllers/emailController');
      
      // Procesar el envío real de emails
      const result = await processEmailSending(emailData);
      
      console.log(`✅ Emails enviados exitosamente:`, result);
      return result;

    } catch (error) {
      console.error(`❌ Error al enviar emails:`, error);
      throw error;
    }
  }

  // Obtener estadísticas de la cola
  getStats() {
    return {
      ...this.stats,
      queueSize: this.queue.length,
      isProcessing: this.processing
    };
  }

  // Limpiar estadísticas
  clearStats() {
    this.stats = {
      processed: 0,
      errors: 0,
      pending: this.queue.length
    };
  }
}

// Crear instancia global de la cola
const emailQueue = new EmailQueue();

module.exports = emailQueue;
