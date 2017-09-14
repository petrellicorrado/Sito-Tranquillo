'use strict';
var UTENTI = 'utenti';

var bcrypt = require('bcrypt');
var q = require('q');
var encryption = require('../config/encryption');

var mongoose = require('mongoose'),
    Utente = mongoose.model('Utente');

var db;
exports.setDb = function(extdb) {
    db = extdb;
};


function handleError(res, ragione, messaggio, codice) {
    console.log("ERRORE: " + ragione);
    res.status(codice || 500).json({ "errore": messaggio });
}

exports.registraUtente = function(req,res) {
    console.log("POST Utenti");
    
    // Controllo se l'utente esiste già
    Utente.findOne({username:req.body.username})
    .then(function(user){ // Connessione al database riuscita
        if(user){
            
            /* 
                L'utente esiste già
                allora restituisco un errore 409 'Conflict'
            */
            res.status(409).json({'errore': "Esiste già un utente con questo username",
            'username': req.body.username});

        } else { // Utente non trovato quindi lo creo
            
            var password_hash;
            var risposta_segreta_hash;
    
            bcrypt.hash(req.body.password, encryption.saltrounds)
            .then(function(pass_hash){ // Creo l'hash della password
                password_hash = pass_hash;
                bcrypt.hash(req.body.risposta_segreta, encryption.saltrounds)
                .then(function(risp_hash){ // Creo l'hash della risposta
                    risposta_segreta_hash = risp_hash;
                    
                    // creo un utente in base al modello
                    var nuovoUtente = new Utente({
                        username: req.body.username,
                        email: req.body.email,
                        password_hash: password_hash,
                        domanda_segreta:req.body.domanda_segreta,
                        risposta_segreta_hash: risposta_segreta_hash 
                    });
    
                    // salvo l'utente nel database
                    nuovoUtente.save(function(err){
                        if(err)
                            return handleError(res, err, "Errore durante il salvataggio dell'utente nel database"); 
                        else{
                            res.status(201).json(nuovoUtente);
                        }
                    });
                })
                .catch(function(err){
                    return handleError(res,err,"Errore riscontrato durante l'hashing della risposta segreta");
                });
            }).catch(function(err){
                return handleError(res,err,"Errore riscontrato durante l'hashing della password dell'utente");
            });

            
        }
        
    
    })
    .catch(function(err){ // Connessione al database non riuscita
        return handleError(res,err,'Errore riscontrato durante la connessione al database');
    });
        

    
};