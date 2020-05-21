const moment = require('moment')
const conexao = require('../infraestrutura/conexao')

class Atendimento {
    adiciona(atendimento, res) {
        const dataCriacao = moment().format('YYYY-MM-DD HH:mm:ss')
        const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss')

        const dataEhValida = moment(data).isSameOrAfter(dataCriacao)
        const clienteEhValido = atendimento.cliente.length >= 5

        const validacoes = [
            {
                nome: 'data',
                valido: clienteEhValido,
                mensagem: 'Data deve ser igual ou maior do que a atual'
            },
            {
                nome: 'cliente',
                valido: dataEhValida,
                mensagem: 'Cliente deve ter cinco ou mais caracteres'
            }
        ]
        const erros = validacoes.filter(campo => !campo.valido)
        const existemErros = erros.length

        if ( existemErros ) {
            res.status(400).json(erros)
        } else {
            const atendimentoDatado = {...atendimento, dataCriacao, data}
            const sql = 'INSERT INTO atendimentos SET ?'
            conexao.query(sql, atendimentoDatado, (erro, resultados) => {
                if ( erro ) {
                    res.status(400).json()
                } else {
                    res.status(201).json()
                }
            })
        }

    }
    lista(res) {
        const sql = 'SELECT * FROM ATENDIMENTOS'
        conexao.query(sql, (erro, resultados)=> {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultados)
            }
        })
    }
    buscaPorId(id, res) {
        const sql = `SELECT * FROM ATENDIMENTOS WHERE ID = ${id}`
        conexao.query(sql, (erro, resultados) => {
            const atendimento = resultados[0]
            if(erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(atendimento)
            }
        })
    }
    atualiza(id, valores, res) {
        if ( valores.data ) {
            valores.data = moment(valores.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss')
        }

        const sql = 'UPDATE ATENDIMENTOS SET ? WHERE id=?'
        conexao.query(sql, [valores, id], (erro, resultados) => {
            if ( erro ) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultados)
            }
        })
    }
    deleta(id, res) {
        const sql = 'DELETE FROM ATENDIMENTOS WHERE id=?'
        conexao.query(sql, id, (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json({'id':id})
            }
        })
    }
}

module.exports = new Atendimento