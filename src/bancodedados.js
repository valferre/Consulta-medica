module.exports = {
    identificadorConsultas: 3,
    consultorio: {
      nome: "Cubos Healthcare",
      identificador: 1,
      cnes: "1001",
      senha: "CubosHealth@2022",
      medicos: [
        {
          identificador: 1,
          nome: "Bill",
          especialidade: "GERAL",
        },
        {
          identificador: 2,
          nome: "Irineu",
          especialidade: "ODONTOLOGIA"
        },
      ]
    },
    consultas: [
    //array de consultas

  {
    identificador: 1,
    tipoConsulta: "GERAL",
    identificadorMedico: 1,
    finalizada: true,
    identificadorLaudo: 1,
    valorConsulta: 3000,
    paciente: {
      nome: "John Doe",
      cpf: "55132392051",
      dataNascimento: "2022-02-02",
      celular: "11999997777",
      email: "john@doe.com",
      senha: "1234",
    },
  },
  {
    identificador: 2,
    tipoConsulta: "ODONTOLOGIA",
    identificadorMedico: 2,
    finalizada: false,
    identificadorLaudo: 1,
    valorConsulta: 5000,
    paciente: {
      nome: "John Doe 2",
      cpf: "55132392052",
      dataNascimento: "2022-02-02",
      celular: "11999997777",
      email: "john@doe2.com",
      senha: "1234",
    },
  },

    ],
    consultasFinalizadas: [
      //array de consultas finalizadas
    ],
    laudos: [
      //array de laudos médicos
  
    ]
  }