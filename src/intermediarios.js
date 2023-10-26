const bancoDeDados = require("./bancodedados");

const validarSenha = (req, res, next) => {
    const { senha_consultorio, cnes_consultorio } = req.query;

    if (!senha_consultorio || !cnes_consultorio) {
        return res.status(401).json({ mensagem: "Dados obrigatórios não informados!" });
    }

    if (senha_consultorio !== bancoDeDados.consultorio.senha || cnes_consultorio != bancoDeDados.consultorio.cnes) {
        return res.status(401).json({ mensagem: "Cnes ou senha inválidos!" });
    }

    next();
};

module.exports = {
    validarSenha,
};