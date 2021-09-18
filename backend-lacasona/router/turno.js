var express = require('express');
var router = express.Router();
var ctrlTurno = require('../controllers/turno');
var ctrlZoom = require('../controllers/zoom');

router.get('/addMeeting/:id_persona',ctrlZoom.addMeeting);

router.get('/getTurnosDisponiblesTipo/:id_tipo',ctrlTurno.getTurnosDisponiblesTipo);
router.post('/add',ctrlTurno.addTurno);
router.put('/asignarTurno',ctrlTurno.asiganarTurno);
router.put('/update',ctrlTurno.update);
router.put('/delete',ctrlTurno.delete);
router.get('/getTurnos',ctrlTurno.getTurnos);
router.get('/getTurnosProfesionales',ctrlTurno.getTurnosParaProfesionales);
router.get('/getTurnosLimit/:limit',ctrlTurno.getTurnosLimit);
router.get('/getTurnosAsignados',ctrlTurno.getTurnosAsignados);
router.get('/getTurnoFecha/:fecha',ctrlTurno.getTurnosFecha);
router.get('/getTurnoFechaTipo/:fecha/:tipo',ctrlTurno.getTurnosFechaTipo);
router.get('/getFechas/:fecha1/:fecha2',ctrlTurno.getTurnosFechas);
router.get('/getTurnoConsultaPrecio',ctrlTurno.getTurnoConsultaPrecio);
router.get('/getTurnoId/:id',ctrlTurno.getTurnoId);

router.get('/getFechasTurnosSegunProfesional/:id_profesional',ctrlTurno.getFechasTurnosSegunProfesional);
router.get('/getTurnosPorFechaYProfesional/:fecha/:id_profesional',ctrlTurno.getTurnosPorFechaYProfesional);
router.get('/getTurnosDisponiblesTipoTodos/:tipo',ctrlTurno.getTurnosDisponiblesTipoTodos);

router.get('/getTurnosAsignadosAPacientes/:id_paciente',ctrlTurno.getTurnosAsignadosAPacientes);
router.get('/getProximoTurnoPaciente/:id_paciente',ctrlTurno.getProximoTurnoPaciente);

router.get('/getTurnosEntrevistaAdmisionPorFecha/:fecha',ctrlTurno.getTurnosEntrevistaAdmisionPorFecha);
router.get('/getTurnosEntrevistaAdmision',ctrlTurno.getTurnosEntrevistaAdmision);
router.post('/turnosGrupales',ctrlTurno.turnosGrupales);
router.post('/turnosGrupalesProfesionales',ctrlTurno.turnosGrupalesProfesional);
router.get('/getTurnosGrupalesProfesional',ctrlTurno.getTurnosGrupalesProfesional);
router.get('/getTurnosTipoGrupal/:id',ctrlTurno.getTurnosTipoGrupal);
router.get('/getTurnosTipoGrupalProfesional/:id',ctrlTurno.getTurnosTipoGrupalProfesional);
router.get('/getTurnosTipoIndividual/:id',ctrlTurno.getTurnosTipoIndividual);
router.get('/getTurnosGrupales/:id',ctrlTurno.getTurnosGrupales);
router.delete('/deleteTurnoGrupal/:id_paciente_turno',ctrlTurno.deleteTurnoGrupal);
router.delete('/deleteTurnoGrupalProfesional/:id_profesional_turno',ctrlTurno.deleteTurnoGrupalProfesional);
router.delete('/deleteTurnoGrupalProfesionalPorTurno/:id_turno',ctrlTurno.deleteTurnoGrupalProfesionalPorTurno);

router.get('/getProximoTurnoGrupal/:id',ctrlTurno.getProximoTurnoGrupal);
router.get('/getTurnosGruplesComoAdicional/:id_profesional/:fecha',ctrlTurno.getTurnosGrupalesComoAdicional);
router.get('/getProfesionalTitularTurnoGrupal/:id_turno',ctrlTurno.getProfesionalTitularTurnoGrupal);

module.exports = router;
