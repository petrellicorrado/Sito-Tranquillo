'use strict';

var multer = require('multer');
// Importo funzioni utili in generale
var utilities = require('../utilities/utilities');
/**
 * Parametro che indica il percorso in cui 
 * verranno caricate le immagini
 */
var PERCORSO_UPLOADS = './app/images/uploads/';

// Impostazioni per multer
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, PERCORSO_UPLOADS)
    },
    filename: function(req, file, cb) {
        var datetimestamp = Date.now();
        // qui sotto il codice per salvare correttamente il file
        // ci attacco un timestamp così non ci sono duplicati
        // lo split serve perché normalmente multer salverebbe senza estenzione
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    }
});
// istanza di multer con le opzioni appena specificate
var upload = multer({
    storage: storage
}).single('file');

/*
    Carica un'immagine nella cartella specificata dal parametro presente in questo file
*/
exports.caricaImmagine = function(req, res) {
    console.log("UPLOAD TRAMITE POST immagine");
    // API per l'upload
    upload(req, res, function(err) {
        if (err) {
            res.json({ error_code: 1, err_desc: err });
            return utilities.handleError(res, err, '');
        }
        res.json({ error_code: 0, err_desc: null, nomeFile: req.file.filename });
    });
};