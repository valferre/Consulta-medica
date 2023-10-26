const bancoDeDados = require("../bancodedados");

const listarConsultas = (req, res) => {
  return res.status(200).json(bancoDeDados.consultas);
};

const criarNovaConsulta = (req, res) => {
  const { tipoConsulta, valorConsulta, paciente } = req.body;
  const { nome, cpf, dataNascimento, celular, email, senha } = paciente;

  if (
    !tipoConsulta ||
    !valorConsulta ||
    !nome ||
    !cpf ||
    !dataNascimento ||
    !celular ||
    !email ||
    !senha
  ) {
    return res
      .status(400)
      .json({ mensagem: "Campo obrigatório não informado!" });
  }

  if (!Number(valorConsulta)) {
    return res
      .status(400)
      .json({ mensagem: "Valor da consulta não é um número válido!" });
  }

  const cpfExistente = bancoDeDados.consultas.find((consultaAtual) => {
    return (
      consultaAtual.paciente.cpf === cpf && consultaAtual.finalizada === false
    );
  });
  if (cpfExistente) {
    return res.status(400).json({
      mensagem: "Já existe uma consulta em andamento com o cpf informado!",
    });
  }

  const validarEspecialista = bancoDeDados.consultorio.medicos.find(
    (medicoAtual) => {
      return medicoAtual.especialidade === tipoConsulta;
    }
  );
  if (!validarEspecialista) {
    return res.status(400).json({ mensagem: "Especialidade inválida!" });
  }
  let identificador =
    bancoDeDados.consultas.length == 0 ? 1 : bancoDeDados.consultas.length + 1;

  const consulta = {
    identificador,
    identificadorMedico: validarEspecialista.identificador,
    finalizada: false,
    tipoConsulta,
    valorConsulta: Number(valorConsulta),
    paciente: {
      nome,
      cpf,
      dataNascimento,
      celular,
      email,
      senha,
    },
  };

  bancoDeDados.consultas.push(consulta);

  return res.status(201).json();
};

const atualizarConsulta = (req, res) => {
  const { identificadorConsulta } = req.params;
  const { nome, cpf, dataNascimento, celular, email, senha } = req.body;

  if (!nome || !cpf || !dataNascimento || !celular || !email || !senha) {
    return res
      .status(400)
      .json({ mensagem: "Campo obrigatório não informado!" });
  }

  const idValido = bancoDeDados.consultas.find(
    (item) => item.identificador == identificadorConsulta
  );

  if (!idValido) {
    return res
      .status(400)
      .json({ mensagem: "O identificador da consulta não é válido!" });
  }

  const cpfExistente = bancoDeDados.consultas.find((consultaAtual) => {
    return consultaAtual.paciente.cpf === cpf;
  });
  if (cpfExistente) {
    return res.status(400).json({ mensagem: "Cpf já consta na base!" });
  }

  const emailExistente = bancoDeDados.consultas.find((consultaAtual) => {
    return consultaAtual.paciente.email === email;
  });
  if (emailExistente) {
    return res.status(400).json({ mensagem: "Email já consta na base!!" });
  }

  const consultaFinalizada = bancoDeDados.consultas.find((statusConsulta) => {
    return (
      statusConsulta.identificador === Number(identificadorConsulta) &&
      statusConsulta.finalizada === false
    );
  });
  if (!consultaFinalizada) {
    return res.status(400).json({
      mensagem: "Consulta não pode ser atualizada, pois já foi finalizada!",
    });
  }

  (consultaFinalizada.paciente.nome = nome),
    (consultaFinalizada.paciente.cpf = cpf),
    (consultaFinalizada.paciente.dataNascimento = dataNascimento),
    (consultaFinalizada.paciente.celular = celular),
    (consultaFinalizada.paciente.email = email),
    (consultaFinalizada.paciente.senha = senha);

  return res.status(204).json();
};

const excluirConsulta = (req, res) => {
  const { identificadorConsulta } = req.params;

  const consultaExistente = bancoDeDados.consultas.find((consulta) => {
    return consulta.identificador === Number(identificadorConsulta);
  });

  if (!consultaExistente) {
    return res.status(404).json({ mensagem: "A consulta não existe!" });
  }

  if (consultaExistente.finalizada === true) {
    return res.status(400).json({
      mensagem:
        "A consulta só pode ser removida se a mesma não estiver finalizada",
    });
  }

  const novoDb = bancoDeDados.consultas.filter(
    (consulta) => consulta.identificador != identificadorConsulta
  );

  bancoDeDados.consultas = novoDb;

  return res.status(204).json();
};

const finalizarConsultaMedica = (req, res) => {
  const { identificadorConsulta, textoMedico } = req.body;

  if (!identificadorConsulta || !textoMedico) {
    return res
      .status(400)
      .json({ mensagem: "Campo obrigatório não informado!" });
  }

  const consultaExiste = bancoDeDados.consultas.find((consulta) => {
    return consulta.identificador === Number(identificadorConsulta);
  });
  if (!consultaExiste) {
    return res.status(404).json({
      mensagem: "O identificador não corresponde a uma consulta válida!",
    });
  }
  const findaConsulta = bancoDeDados.consultas.find((statusConsulta) => {
    return (
      statusConsulta.identificador === Number(identificadorConsulta) &&
      statusConsulta.finalizada === false
    );
  });
  if (!findaConsulta) {
    return res.status(400).json({
      mensagem: "Não é possível finalizar uma consulta que já está finalizada!",
    });
  }

  if (textoMedico.length < 0 || textoMedico.length > 200) {
    return res.status(400).json({
      mensagem: "O tamanho do textoMedico não está dentro do esperado!",
    });
  }

  const finalizada = bancoDeDados.consultas.map((consulta) => {
    if (consulta.identificador == consultaExiste.identificador) {
      return (consulta.finalizada = true);
    }
  });

  let identificadorLaudo =
    bancoDeDados.laudos.length == 0 ? 1 : bancoDeDados.laudos.length + 1;

  const consultaFinalizada = {
    identificador: consultaExiste.identificador,
    tipoConsulta: consultaExiste.tipoConsulta,
    identificadorMedico: consultaExiste.identificadorMedico,
    finalizada: finalizada,
    identificadorLaudo: identificadorLaudo,
    valorConsulta: consultaExiste.valorConsulta,
    paciente: {
      nome: consultaExiste.paciente.nome,
      cpf: consultaExiste.paciente.cpf,
      dataNascimento: consultaExiste.paciente.dataNascimento,
      celular: consultaExiste.paciente.celular,
      email: consultaExiste.paciente.email,
      senha: consultaExiste.paciente.senha,
    },
  };

  const registroDeLaudo = {
    identificador: identificadorLaudo,
    identificadorConsulta: consultaExiste.identificador,
    identificadorMedico: consultaExiste.identificadorMedico,
    textoMedico: textoMedico,
    paciente: {
      nome: consultaExiste.paciente.nome,
      cpf: consultaExiste.paciente.cpf,
      dataNascimento: consultaExiste.paciente.dataNascimento,
      celular: consultaExiste.paciente.celular,
      email: consultaExiste.paciente.email,
      senha: consultaExiste.paciente.senha,
    },
  };

  if (finalizada) {
    bancoDeDados.consultasFinalizadas.push(consultaFinalizada);
    bancoDeDados.laudos.push(registroDeLaudo);
    console.log(bancoDeDados);
    return res.status(204).json();
  }
};

const listarLaudo = (req, res) => {
  const { identificador_consulta, senha } = req.query;

  if (!identificador_consulta) {
    return res.status(400).json({
      mensagem: "É obrigatório informar o identificador da consulta!",
    });
  }

  if (!senha) {
    return res
      .status(400)
      .json({ mensagem: "É obrigatório informar a senha de acesso!" });
  }

  const consultaExiste = bancoDeDados.consultas.find((consulta) => {
    return consulta.identificador === Number(identificador_consulta);
  });


  if (!consultaExiste) {
    return res
      .status(400)
      .json({ mensagem: "Consulta médica não encontrada!" });
  }
  if (senha != consultaExiste.paciente.senha) {
    return res.status(401).json({ mensagem: "senha inválida!" });
  }

  const laudoExiste = bancoDeDados.laudos.find((laudo) => {
    return laudo.identificadorConsulta === Number(identificador_consulta);
  });

  if (!laudoExiste) {
    return res
      .status(400)
      .json({ mensagem: "Não há laudo disponível para essa consulta!" });
  }

  return res.status(200).json(laudoExiste);
};

const listarConsultasMedico = (req, res) => {
  const { identificador_medico } = req.query;

  if (!identificador_medico) {
    return res
      .status(400)
      .json({ mensagem: "Informe o identificador do médico!" });
  }

  const medicoExiste = bancoDeDados.consultorio.medicos.find((id) => {
    return id.identificador === Number(identificador_medico);
  });
  if (!medicoExiste) {
    return res
      .status(404)
      .json({ mensagem: "O médico informado não existe na base!" });
  }

  const consultasDoMedico = bancoDeDados.consultas.filter((consultas) => {
    return consultas.identificadorMedico === Number(identificador_medico);
  });
  if (consultasDoMedico) return res.status(200).json(consultasDoMedico);
};

module.exports = {
  listarConsultas,
  criarNovaConsulta,
  atualizarConsulta,
  excluirConsulta,
  finalizarConsultaMedica,
  listarLaudo,
  listarConsultasMedico,
};
