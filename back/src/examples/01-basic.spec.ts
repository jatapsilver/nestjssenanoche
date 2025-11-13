/**
 * ============================================
 * NIVEL 1: TESTS BÁSICOS - PRIMEROS PASOS
 * ============================================
 *
 * Aquí aprenderás los conceptos más básicos de testing:
 * - Qué es un test
 * - Cómo se estructura un test
 * - Cómo ejecutar tests
 */

/**
 * describe() agrupa tests relacionados
 * Es como una carpeta que organiza tus tests
 *
 * Sintaxis: describe('nombre del grupo', () => { ... })
 */
describe('Mis Primeros Tests', () => {
  /**
   * it() o test() define un test individual
   * Es la prueba específica que quieres hacer
   *
   * Sintaxis: it('descripción de lo que prueba', () => { ... })
   */
  it('mi primer test - siempre pasa', () => {
    // Este test no hace nada, solo pasa
    // Es válido pero no muy útil
  });

  /**
   * expect() es la función para hacer afirmaciones
   * Compara un valor con lo que esperamos
   */
  it('prueba una suma simple', () => {
    const resultado = 2 + 2;

    // expect(valor).toBe(valorEsperado)
    // toBe() compara valores primitivos (números, strings, booleanos)
    expect(resultado).toBe(4);
  });

  it('prueba una resta', () => {
    const resultado = 10 - 3;
    expect(resultado).toBe(7);
  });

  it('compara textos', () => {
    const nombre = 'Juan';
    expect(nombre).toBe('Juan');
  });

  it('compara booleanos', () => {
    const esMayorDeEdad = true;
    expect(esMayorDeEdad).toBe(true);
  });

  /**
   * También puedes usar .not para negar una expectativa
   */
  it('verifica que algo NO sea igual', () => {
    const numero = 5;
    expect(numero).not.toBe(10);
  });
});

/**
 * ============================================
 * TESTS CON DIFERENTES MATCHERS (COMPARADORES)
 * ============================================
 */
describe('Aprendiendo Matchers', () => {
  /**
   * toBe() - Para valores primitivos (números, strings, booleanos)
   */
  it('toBe - compara valores exactos', () => {
    expect(2 + 2).toBe(4);
    expect('hola').toBe('hola');
    expect(true).toBe(true);
  });

  /**
   * toEqual() - Para objetos y arrays
   * Compara el contenido, no la referencia en memoria
   */
  it('toEqual - compara objetos', () => {
    const persona = { nombre: 'Ana', edad: 25 };
    expect(persona).toEqual({ nombre: 'Ana', edad: 25 });
  });

  it('toEqual - compara arrays', () => {
    const numeros = [1, 2, 3];
    expect(numeros).toEqual([1, 2, 3]);
  });

  /**
   * toBeTruthy() y toBeFalsy()
   * Verifica si algo es verdadero o falso en JavaScript
   */
  it('toBeTruthy - verifica valores verdaderos', () => {
    expect(true).toBeTruthy();
    expect(1).toBeTruthy();
    expect('texto').toBeTruthy();
    expect([]).toBeTruthy(); // Array vacío es truthy
  });

  it('toBeFalsy - verifica valores falsos', () => {
    expect(false).toBeFalsy();
    expect(0).toBeFalsy();
    expect('').toBeFalsy();
    expect(null).toBeFalsy();
    expect(undefined).toBeFalsy();
  });

  /**
   * toBeNull(), toBeUndefined(), toBeDefined()
   */
  it('verifica null', () => {
    const valor = null;
    expect(valor).toBeNull();
  });

  it('verifica undefined', () => {
    let valor;
    expect(valor).toBeUndefined();
  });

  it('verifica si está definido', () => {
    const valor = 'algo';
    expect(valor).toBeDefined();
  });

  /**
   * Comparadores numéricos
   */
  it('compara números - mayor que', () => {
    expect(10).toBeGreaterThan(5);
  });

  it('compara números - mayor o igual que', () => {
    expect(10).toBeGreaterThanOrEqual(10);
  });

  it('compara números - menor que', () => {
    expect(5).toBeLessThan(10);
  });

  it('compara números - menor o igual que', () => {
    expect(5).toBeLessThanOrEqual(5);
  });

  /**
   * Comparadores para strings
   */
  it('verifica si un string contiene otro', () => {
    const texto = 'Hola Mundo';
    expect(texto).toContain('Mundo');
  });

  it('verifica si un string coincide con una expresión regular', () => {
    const email = 'test@example.com';
    expect(email).toMatch(/@/); // Contiene @
    expect(email).toMatch(/^[^@]+@[^@]+\.[^@]+$/); // Formato de email
  });

  /**
   * Comparadores para arrays
   */
  it('verifica si un array contiene un elemento', () => {
    const frutas = ['manzana', 'banana', 'naranja'];
    expect(frutas).toContain('banana');
  });

  it('verifica la longitud de un array', () => {
    const numeros = [1, 2, 3, 4, 5];
    expect(numeros).toHaveLength(5);
  });

  /**
   * Comparadores para objetos
   */
  it('verifica si un objeto tiene una propiedad', () => {
    const usuario = { nombre: 'Pedro', edad: 30 };
    expect(usuario).toHaveProperty('nombre');
    expect(usuario).toHaveProperty('nombre', 'Pedro');
  });
});

/**
 * ============================================
 * TESTS CON FUNCIONES
 * ============================================
 */
describe('Probando Funciones', () => {
  /**
   * Función simple para probar
   */
  function sumar(a: number, b: number): number {
    return a + b;
  }

  it('prueba la función sumar', () => {
    const resultado = sumar(3, 5);
    expect(resultado).toBe(8);
  });

  it('prueba sumar con números negativos', () => {
    expect(sumar(-5, 3)).toBe(-2);
  });

  it('prueba sumar con cero', () => {
    expect(sumar(0, 0)).toBe(0);
  });

  /**
   * Función que verifica si un número es par
   */
  function esPar(numero: number): boolean {
    return numero % 2 === 0;
  }

  it('verifica si un número es par', () => {
    expect(esPar(4)).toBe(true);
    expect(esPar(7)).toBe(false);
  });

  /**
   * Función que lanza un error
   */
  function dividir(a: number, b: number): number {
    if (b === 0) {
      throw new Error('No se puede dividir por cero');
    }
    return a / b;
  }

  it('verifica que una función lance un error', () => {
    // Para probar errores, debes envolver la función en otra función
    expect(() => dividir(10, 0)).toThrow();
    expect(() => dividir(10, 0)).toThrow('No se puede dividir por cero');
  });

  it('verifica que la división funciona correctamente', () => {
    expect(dividir(10, 2)).toBe(5);
  });
});

/**
 * ============================================
 * RESUMEN DE LO APRENDIDO
 * ============================================
 *
 * 1. describe() - Agrupa tests relacionados
 * 2. it() o test() - Define un test individual
 * 3. expect() - Hace afirmaciones sobre valores
 *
 * Matchers principales:
 * - toBe() - Valores primitivos
 * - toEqual() - Objetos y arrays
 * - toBeTruthy() / toBeFalsy() - Valores verdaderos/falsos
 * - toBeNull() / toBeUndefined() / toBeDefined()
 * - toBeGreaterThan() / toBeLessThan() - Comparar números
 * - toContain() - Strings y arrays
 * - toHaveLength() - Longitud de arrays
 * - toHaveProperty() - Propiedades de objetos
 * - toThrow() - Errores
 *
 * Para ejecutar estos tests:
 * npm test 01-basic.spec.ts
 */
