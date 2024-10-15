  /**
   * Función del dado
   * @returns {number} Número aleatorio entre 1 y 6
   */
  function tirarDado() {
    return Math.floor(Math.random() * 6) + 1;
  }
  
  /**
   * Función para hacer la tirada de un jugador, donde comprobamos
   * las reglas especiales
   * @param {Object} jugador - Objeto que representa al jugador
   * @returns {number} Suma de los puntos obtenidos o 0 si aplica la regla de perder
   */
  function jugarTurno(jugador) {
    let dado1 = tirarDado();
    let dado2 = tirarDado();
  
    console.log(`${jugador.nombre} tira ${dado1} y ${dado2}`);
  
    // Reglas especiales
    if ((dado1 === 6 && dado2 === 6) || (dado1 === 1 && dado2 === 1)) {
      console.log(`${jugador.nombre} repite tiradas.`);
      return jugarTurno(jugador); // Repite turno
    } else if (dado1 === 5 && dado2 === 5) {
      console.log(`${jugador.nombre} no puede ganar esta ronda.`);
      return 0; // No suma puntos
    }
  
    return dado1 + dado2;
  }
  
  /**
   * Función que crea a los jugadores 
   * @returns {Array} Array de los jugadores con los puntos y rondas ganadas que tiene
  */
  function crearJugadores() {
    let numJugadores = parseInt(prompt("Cuantos jugadores van a participar?"));
    let nombres = new Set();
    
    // Recoge nombres únicos
    while (nombres.size < numJugadores) {
        let nombre = prompt(`Introduce el nombre del jugador ${nombres.size + 1}`);
        if (nombres.has(nombre)) {
            alert("Este nombre ya ha sido introducido. Por favor, elige otro.");
        } else {
            nombres.add(nombre); // Añade el nombre
        }
    }

  // Crea un array de objetos jugadores
  let jugadores = [];
  for (let nombre of nombres) {
      jugadores.push({ nombre: nombre, puntos: 0, rondasGanadas: 0 });
  }

  return jugadores; // Devuelve un array para trabajar fácilmente con los jugadores
}

  
  /**
   * Función para dar turnos aleatoriamente a los jugadores
   * @param {Array} jugadores - Array de jugadores
   * @returns {Array} - Array de jugadores barajado
   */
  function barajarJugadores(jugadores) {
    return jugadores.sort(() => Math.random() - 0.5);
  }
  
  /**
   * Función que realiza las rondas completas
   * @param {Array} jugadores - Array de objetos de los jugadores
   */
  function jugarRonda(jugadores) {
    for (let jugador of jugadores) {
      let puntos = jugarTurno(jugador);
      jugador.puntos += puntos;
      console.log(`${jugador.nombre} ha obtenido ${puntos} puntos en total.`);
    }
  }
  
  /**
   * Función que verifica el ganador de la ronda donde se comparan 
   * los puntos para determinar el ganador de la ronda
   * Si hay empate, hacemos el desempate 
   * @param {Array} jugadores - Array de objetos jugadores
   * @returns {Object} - El jugador que gana la ronda
   */
  function verificarGanador(jugadores) {
    let ganador = jugadores[0]; // Suponemos de comienzo que el primer jugador es el ganador
    let empatados = [ganador];  // Almacena los jugadores que empatan
  
    // Recorremos el resto de jugadores para comparar
    for (let i = 1; i < jugadores.length; i++) {
      let jugador = jugadores[i];
  
      if (jugador.puntos > ganador.puntos) {
        ganador = jugador;
        empatados = [ganador]; // Nuevo ganador, lista de empatados se borra y se queda el nuevo ganador
      } else if (jugador.puntos === ganador.puntos) {
        empatados.push(jugador); // Si hay empate se añade a empatados
      }
    }
  
    // Si hay más de un jugador empatado hacemos el desempate
    if (empatados.length > 1) {
      console.log("Empate entre varios jugadores. Se realiza una tirada extra para desempatar.");
      return desempate(empatados);
    }
  
    return ganador; // Cuando no hay empate damos ganador
  }
  
  /**
   * Función para hacer el desempate 
   * @param {Array} empatados - Jugadores empatados
   * @returns {Object} - El ganador
   */
  function desempate(empatados) {
    let maxPuntos = 0;
    let ganador;
  
    for (let jugador of empatados) {
      let puntos = tirarDado(); // Tirada extra
      console.log(`${jugador.nombre} tira un ${puntos} en el desempate.`);
      if (puntos > maxPuntos) {
        maxPuntos = puntos;
        ganador = jugador;
      }
    }
  
    return ganador;
  }
  
  /**
   * Función base donde se realiza la partida hasta que un jugador gane 3 rondas
   */
  function jugarPartida() {
    let jugadores = crearJugadores();
  
    // Barajar los jugadores antes de que empecemos las rondas
    jugadores = barajarJugadores(jugadores);
    console.log("Orden de turnos inicial: ");
  
    // Mostramos los nombres de los jugadores antes de comenzar para saber el orden
    for (let jugador of jugadores) {
      console.log(jugador.nombre);
    }
  
    let ronda = 0;
    let partidaGanada = false;
  
    while (!partidaGanada) {
      ronda++;
  
      console.log(`\n--- Ronda ${ronda} ---`);
  
      // Reiniciar los puntos de cada jugador para ir comparando las tiradas de cada ronda
      for (let jugador of jugadores) {
        jugador.puntos = 0;
      }
  
      jugarRonda(jugadores);
  
      // Verificar ganador de la ronda
      let ganador = verificarGanador(jugadores);
      ganador.rondasGanadas++;
      console.log(`${ganador.nombre} ha ganado la ronda.`);
  
      // Mostrar marcador
      console.log("Marcador de rondas ganadas:");
      for (let jugador of jugadores) {
        console.log(`${jugador.nombre}: ${jugador.rondasGanadas} rondas ganadas.`);
      }
  
      // Verificar si alguien ha ganado 3 rondas a partir de la tercera ronda
      if (ronda >= 3 && ganador.rondasGanadas >= 3) {
        partidaGanada = true;
        console.log(`${ganador.nombre} ha ganado la partida con 3 rondas ganadas.`);
      }
    }
  }

jugarPartida();
