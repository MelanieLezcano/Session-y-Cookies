const fs = require('fs');
const path = require ('path');
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const users = require('../data/user.json');

const guardar = (dato) => fs.writeFileSync(path.join(__dirname, '../data/user.json')
, JSON.stringify(dato, null, 4), 'utf-8')

module.exports = {
    perfil: (req,res) =>{
        res.render('perfil')
    },
    register: (req, res) => {
        let colores = ["Rosa", "Amarillo claro", "Cian", "Gris", "Amarillo"];
        res.render('register',{colores, texto: 'Completar'});
    },
    processRegister:  (req, res) => {
        const {name, email, edad, pass, colors} = req.body
        let colores = ["Rosa", "Amarillo claro", "Cian", "Gris", "Amarillo"];
        let errors = validationResult(req);


        if (errors.isEmpty()) {
            let usuarioNuevo = {
                id:users[users.length - 1].id + 1,
                name,
                email,
                edad,
                pass: bcrypt.hashSync(pass, 10),
                colors
            };
            users.push(usuarioNuevo);
            guardar(users)
    
            res.redirect('/')
        }else {
            return res.render('register', { 
                colores,
                errors: errors.mapped(),
                old: req.body
            });
        };
    },


    login: (req, res) => {
        let colores = ["Rosa", "Amarillo claro", "Cian", "Gris", "Amarillo"];
        res.render('login',{colores});
    },


    processLogin: (req, res) => {
        let errors = validationResult(req)
        if (errors.isEmpty()) {
        
            const {email,recordarme} = req.body
            let usuario = users.find(user => user.email === email)

            req.session.userLogin = {
                id : usuario.id,
                nombre : usuario.name,
                color : usuario.colors,
                email : usuario.email
            }
            if(recordarme){
                res.cookie('Login',req.session.userLogin,{maxAge: 1000 * 60 * 60})
            }
            return res.redirect('/')
        } else {
            return res.render('login', {
                errors: errors.mapped(),
                old: req.body
            })
        }
    },


    logout: (req,res) => {
        req.session.destroy();
        if(req.cookies.Login){
            res.cookie('Login', "",{maxAge: -1 })
        }
        return res.redirect('/')
    },
}