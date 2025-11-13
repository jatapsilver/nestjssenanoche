/**
 * ============================================
 * NIVEL 2: TESTS INTERMEDIOS
 * ============================================
 *
 * Aquí aprenderás:
 * - beforeEach y afterEach
 * - Agrupar tests anidados
 * - Tests asíncronos
 * - Mocks básicos
 */

/**
 * ============================================
 * SETUP Y TEARDOWN (beforeEach, afterEach)
 * ============================================
 */
describe('Setup y Teardown', () => {
  let contador: number;

  /**
   * beforeEach() se ejecuta ANTES de cada test
   * Útil para preparar datos o resetear estado
   */
  beforeEach(() => {
    console.log('⚙️ Preparando test...');
    contador = 0; // Reseteamos el contador antes de cada test
  });

  /**
   * afterEach() se ejecuta DESPUÉS de cada test
   * Útil para limpiar datos o liberar recursos
   */
  afterEach(() => {
    console.log('🧹 Limpiando después del test...');
    contador = 0;
  });

  it('incrementa el contador', () => {
    contador++;
    expect(contador).toBe(1);
  });

  it('el contador empieza en 0 gracias a beforeEach', () => {
    // Aunque el test anterior incrementó el contador,
    // beforeEach lo resetea antes de este test
    expect(contador).toBe(0);
  });

  it('incrementa el contador dos veces', () => {
    contador++;
    contador++;
    expect(contador).toBe(2);
  });
});

/**
 * ============================================
 * beforeAll y afterAll
 * ============================================
 */
describe('Setup y Teardown - beforeAll/afterAll', () => {
  let baseDatos: string[];

  /**
   * beforeAll() se ejecuta UNA SOLA VEZ antes de todos los tests
   * Útil para operaciones costosas como conectar a BD
   */
  beforeAll(() => {
    console.log('🚀 Conectando a la base de datos...');
    baseDatos = ['dato1', 'dato2', 'dato3'];
  });

  /**
   * afterAll() se ejecuta UNA SOLA VEZ después de todos los tests
   * Útil para cerrar conexiones
   */
  afterAll(() => {
    console.log('🔌 Desconectando de la base de datos...');
    baseDatos = [];
  });

  it('verifica que la BD tiene datos', () => {
    expect(baseDatos).toHaveLength(3);
  });

  it('puede leer datos de la BD', () => {
    expect(baseDatos[0]).toBe('dato1');
  });
});

/**
 * ============================================
 * TESTS ANIDADOS (describe dentro de describe)
 * ============================================
 */
describe('Calculadora', () => {
  /**
   * Puedes anidar describe() para mejor organización
   */
  describe('Suma', () => {
    it('suma dos números positivos', () => {
      expect(2 + 3).toBe(5);
    });

    it('suma dos números negativos', () => {
      expect(-2 + -3).toBe(-5);
    });

    it('suma un positivo y un negativo', () => {
      expect(5 + -3).toBe(2);
    });
  });

  describe('Resta', () => {
    it('resta dos números positivos', () => {
      expect(5 - 3).toBe(2);
    });

    it('resta dos números negativos', () => {
      expect(-5 - -3).toBe(-2);
    });
  });

  describe('Multiplicación', () => {
    it('multiplica dos números positivos', () => {
      expect(3 * 4).toBe(12);
    });

    it('multiplica por cero', () => {
      expect(5 * 0).toBe(0);
    });
  });
});

/**
 * ============================================
 * TESTS ASÍNCRONOS CON PROMESAS
 * ============================================
 */
describe('Código Asíncrono', () => {
  /**
   * Función que simula una llamada a API
   * Retorna una promesa
   */
  function obtenerUsuario(id: number): Promise<{ id: number; nombre: string }> {
    return new Promise((resolve) => {
      // Simula un delay de red
      setTimeout(() => {
        resolve({ id, nombre: 'Usuario ' + id });
      }, 100);
    });
  }

  /**
   * Para probar promesas, puedes usar async/await
   */
  it('obtiene un usuario desde la API', async () => {
    const usuario = await obtenerUsuario(1);

    expect(usuario).toEqual({
      id: 1,
      nombre: 'Usuario 1',
    });
  });

  /**
   * O puedes retornar la promesa directamente
   */
  it('obtiene un usuario - retornando promesa', () => {
    return obtenerUsuario(2).then((usuario) => {
      expect(usuario.id).toBe(2);
      expect(usuario.nombre).toBe('Usuario 2');
    });
  });

  /**
   * Para probar promesas que se rechazan (errores)
   */
  function obtenerUsuarioConError(): Promise<any> {
    return Promise.reject(new Error('Usuario no encontrado'));
  }

  it('maneja errores en promesas', async () => {
    // expect().rejects se usa para promesas rechazadas
    await expect(obtenerUsuarioConError()).rejects.toThrow(
      'Usuario no encontrado',
    );
  });
});

/**
 * ============================================
 * TESTS CON TIMERS (setTimeout, setInterval)
 * ============================================
 */
describe('Trabajando con Timers', () => {
  /**
   * Jest puede simular el tiempo para que los tests sean rápidos
   */
  beforeEach(() => {
    // Activa los timers falsos de Jest
    jest.useFakeTimers();
  });

  afterEach(() => {
    // Restaura los timers reales
    jest.useRealTimers();
  });

  it('ejecuta un callback después de 1 segundo', () => {
    const callback = jest.fn(); // Mock de función

    setTimeout(callback, 1000);

    // El callback aún no se ejecutó
    expect(callback).not.toHaveBeenCalled();

    // Avanzamos el tiempo 1 segundo
    jest.advanceTimersByTime(1000);

    // Ahora sí se ejecutó
    expect(callback).toHaveBeenCalled();
  });

  it('ejecuta todos los timers pendientes', () => {
    const callback = jest.fn();

    setTimeout(callback, 1000);
    setTimeout(callback, 2000);

    // Ejecuta todos los timers sin importar el tiempo
    jest.runAllTimers();

    expect(callback).toHaveBeenCalledTimes(2);
  });
});

/**
 * ============================================
 * INTRODUCCIÓN A MOCKS
 * ============================================
 */
describe('Mocks Básicos', () => {
  /**
   * jest.fn() crea una función mock
   * Útil para verificar si una función fue llamada
   */
  it('crea una función mock', () => {
    const mockFn = jest.fn();

    // Llama la función
    mockFn('hola');

    // Verifica que fue llamada
    expect(mockFn).toHaveBeenCalled();
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('hola');
  });

  /**
   * Puedes hacer que el mock retorne un valor
   */
  it('mock que retorna un valor', () => {
    const mockFn = jest.fn().mockReturnValue(42);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const resultado = mockFn();

    expect(resultado).toBe(42);
    expect(mockFn).toHaveBeenCalled();
  });

  /**
   * Mock que retorna diferentes valores en cada llamada
   */
  it('mock con múltiples valores de retorno', () => {
    const mockFn = jest
      .fn()
      .mockReturnValueOnce('primera')
      .mockReturnValueOnce('segunda')
      .mockReturnValue('default');

    expect(mockFn()).toBe('primera');
    expect(mockFn()).toBe('segunda');
    expect(mockFn()).toBe('default');
    expect(mockFn()).toBe('default'); // Siempre retorna 'default' después
  });

  /**
   * Mock que simula una función asíncrona
   */
  it('mock de función asíncrona', async () => {
    const mockAsyncFn = jest.fn().mockResolvedValue({ data: 'test' });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const resultado = await mockAsyncFn();

    expect(resultado).toEqual({ data: 'test' });
    expect(mockAsyncFn).toHaveBeenCalled();
  });

  /**
   * Mock que simula un error asíncrono
   */
  it('mock que rechaza una promesa', async () => {
    const mockAsyncFn = jest
      .fn()
      .mockRejectedValue(new Error('Error simulado'));

    await expect(mockAsyncFn()).rejects.toThrow('Error simulado');
  });
});

/**
 * ============================================
 * TESTS CON CLASES
 * ============================================
 */
describe('Probando Clases', () => {
  /**
   * Clase simple para probar
   */
  class Contador {
    private valor: number;

    constructor(valorInicial: number = 0) {
      this.valor = valorInicial;
    }

    incrementar(): void {
      this.valor++;
    }

    decrementar(): void {
      this.valor--;
    }

    obtenerValor(): number {
      return this.valor;
    }

    reset(): void {
      this.valor = 0;
    }
  }

  let contador: Contador;

  beforeEach(() => {
    // Creamos una nueva instancia antes de cada test
    contador = new Contador();
  });

  it('empieza en 0', () => {
    expect(contador.obtenerValor()).toBe(0);
  });

  it('puede iniciar con un valor', () => {
    const contadorConValor = new Contador(10);
    expect(contadorConValor.obtenerValor()).toBe(10);
  });

  it('incrementa el valor', () => {
    contador.incrementar();
    expect(contador.obtenerValor()).toBe(1);
  });

  it('decrementa el valor', () => {
    contador.decrementar();
    expect(contador.obtenerValor()).toBe(-1);
  });

  it('resetea el valor', () => {
    contador.incrementar();
    contador.incrementar();
    contador.reset();
    expect(contador.obtenerValor()).toBe(0);
  });

  it('múltiples operaciones', () => {
    contador.incrementar(); // 1
    contador.incrementar(); // 2
    contador.decrementar(); // 1
    contador.incrementar(); // 2
    expect(contador.obtenerValor()).toBe(2);
  });
});

/**
 * ============================================
 * RESUMEN DE LO APRENDIDO
 * ============================================
 *
 * Setup y Teardown:
 * - beforeEach() - Se ejecuta antes de cada test
 * - afterEach() - Se ejecuta después de cada test
 * - beforeAll() - Se ejecuta una vez antes de todos los tests
 * - afterAll() - Se ejecuta una vez después de todos los tests
 *
 * Tests Asíncronos:
 * - Usa async/await para probar promesas
 * - expect().rejects para promesas rechazadas
 * - expect().resolves para promesas exitosas
 *
 * Mocks:
 * - jest.fn() - Crea una función mock
 * - mockReturnValue() - Define qué retorna el mock
 * - mockResolvedValue() - Mock de promesa exitosa
 * - mockRejectedValue() - Mock de promesa rechazada
 * - toHaveBeenCalled() - Verifica si se llamó
 * - toHaveBeenCalledWith() - Verifica con qué argumentos
 *
 * Timers:
 * - jest.useFakeTimers() - Simula timers
 * - jest.advanceTimersByTime() - Avanza el tiempo
 * - jest.runAllTimers() - Ejecuta todos los timers
 */
