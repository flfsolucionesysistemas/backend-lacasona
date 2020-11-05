-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Nov 02, 2020 at 09:29 PM
-- Server version: 5.6.17
-- PHP Version: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `la_casona_web`
--

-- --------------------------------------------------------

--
-- Table structure for table `entrevista`
--

CREATE TABLE IF NOT EXISTS `entrevista` (
  `id_entrevista` int(11) NOT NULL AUTO_INCREMENT,
  `id_persona` int(11) NOT NULL,
  `fecha_creacion` datetime NOT NULL,
  `resultado` varchar(100) DEFAULT NULL,
  `costo` int(11) NOT NULL,
  PRIMARY KEY (`id_entrevista`),
  KEY `id_persona` (`id_persona`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `evolucion`
--

CREATE TABLE IF NOT EXISTS `evolucion` (
  `id_evolucion` int(11) NOT NULL AUTO_INCREMENT,
  `id_persona_creacion` int(11) NOT NULL,
  `id_tratamiento` int(11) NOT NULL,
  `descripcion` varchar(300) DEFAULT NULL,
  `fecha_creacion` datetime NOT NULL,
  `medicacion` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id_evolucion`),
  KEY `id_persona_creacion` (`id_persona_creacion`),
  KEY `id_tratamiento` (`id_tratamiento`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `historia_clinica`
--

CREATE TABLE IF NOT EXISTS `historia_clinica` (
  `id_historia_clinica` int(11) NOT NULL AUTO_INCREMENT,
  `id_persona_paciente` int(11) NOT NULL,
  `id_persona_creacion` int(11) NOT NULL,
  `numero_historia_clinica` varchar(100) NOT NULL,
  `fecha_creacion` datetime NOT NULL,
  PRIMARY KEY (`id_historia_clinica`),
  KEY `id_persona_paciente` (`id_persona_paciente`),
  KEY `id_persona_creacion` (`id_persona_creacion`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `localidad`
--

CREATE TABLE IF NOT EXISTS `localidad` (
  `id_localidad` int(11) NOT NULL AUTO_INCREMENT,
  `id_provincia` int(11) NOT NULL,
  `nombre` varchar(200) NOT NULL,
  PRIMARY KEY (`id_localidad`),
  KEY `id_provincia` (`id_provincia`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `localidad`
--

INSERT INTO `localidad` (`id_localidad`, `id_provincia`, `nombre`) VALUES
(1, 1, 'Corrientes');

-- --------------------------------------------------------

--
-- Table structure for table `pago`
--

CREATE TABLE IF NOT EXISTS `pago` (
  `id_pago` int(11) NOT NULL AUTO_INCREMENT,
  `id_tipo_pago` int(11) NOT NULL,
  `tipo_pago` varchar(100) DEFAULT NULL,
  `fecha` datetime NOT NULL,
  `total` int(11) NOT NULL,
  `estado` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_pago`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `patologia`
--

CREATE TABLE IF NOT EXISTS `patologia` (
  `id_patologia` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(200) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL,
  PRIMARY KEY (`id_patologia`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `patologia_profesional`
--

CREATE TABLE IF NOT EXISTS `patologia_profesional` (
  `id_patologia_profesional` int(11) NOT NULL AUTO_INCREMENT,
  `id_persona` int(11) NOT NULL,
  `id_patologia` int(11) NOT NULL,
  `activo` tinyint(1) NOT NULL,
  PRIMARY KEY (`id_patologia_profesional`),
  KEY `id_persona` (`id_persona`),
  KEY `id_patologia` (`id_patologia`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `persona`
--

CREATE TABLE IF NOT EXISTS `persona` (
  `id_persona` int(11) NOT NULL AUTO_INCREMENT,
  `id_tipo_persona` int(11) NOT NULL,
  `id_localidad` int(11) NOT NULL,
  `dni` varchar(100) DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `nombre_usuario` varchar(100) DEFAULT NULL,
  `clave_usuario` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telefono` varchar(100) DEFAULT NULL,
  `estado` varchar(100) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL,
  PRIMARY KEY (`id_persona`),
  UNIQUE KEY `dni` (`dni`),
  UNIQUE KEY `email` (`email`),
  KEY `id_tipo_persona` (`id_tipo_persona`),
  KEY `id_localidad` (`id_localidad`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `persona`
--

INSERT INTO `persona` (`id_persona`, `id_tipo_persona`, `id_localidad`, `dni`, `nombre`, `apellido`, `nombre_usuario`, `clave_usuario`, `email`, `telefono`, `estado`, `activo`) VALUES
(2, 1, 1, NULL, 'kaka', 'akita', 'lala', 'lala', NULL, NULL, NULL, 1),
(3, 1, 1, NULL, 'Arya', 'fau', NULL, NULL, NULL, NULL, NULL, 1),
(4, 1, 1, NULL, 'Arya', 'fau', NULL, NULL, NULL, NULL, NULL, 1),
(5, 1, 1, NULL, 'analia', 'faure', 'analia123', '$2a$10$Ni0Px.tkqy1jmlrxHCQ3ierS14/D9RNqySa.zr7DUi6W1eHBA8ALi', NULL, NULL, NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `provincia`
--

CREATE TABLE IF NOT EXISTS `provincia` (
  `id_provincia` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `activo` tinyint(1) NOT NULL,
  PRIMARY KEY (`id_provincia`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `provincia`
--

INSERT INTO `provincia` (`id_provincia`, `nombre`, `activo`) VALUES
(1, 'Corrientes', 1);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tipo_persona`
--

CREATE TABLE IF NOT EXISTS `tipo_persona` (
  `id_tipo_persona` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(200) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL,
  PRIMARY KEY (`id_tipo_persona`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `tipo_persona`
--

INSERT INTO `tipo_persona` (`id_tipo_persona`, `nombre`, `descripcion`, `activo`) VALUES
(1, 'Admin', 'el capo', 1),
(2, 'Profesional', 'Trabajador de la salud', 1),
(3, 'Cliente', 'Solicitante de consulta', 1),
(4, 'Paciente', 'Con programa de rehabilitacion en curso', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tratamiento`
--

CREATE TABLE IF NOT EXISTS `tratamiento` (
  `id_tratamiento` int(11) NOT NULL AUTO_INCREMENT,
  `id_historia_clinica` int(11) NOT NULL,
  `id_patologia` int(11) NOT NULL,
  `fase` varchar(100) NOT NULL,
  `costo` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_tratamiento`),
  KEY `id_historia_clinica` (`id_historia_clinica`),
  KEY `id_patologia` (`id_patologia`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `turno`
--

CREATE TABLE IF NOT EXISTS `turno` (
  `id_turno` int(11) NOT NULL AUTO_INCREMENT,
  `id_tipo_turno` int(11) NOT NULL,
  `tipo_turno` varchar(100) DEFAULT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `estado` varchar(100) DEFAULT NULL,
  `observacion` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id_turno`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `entrevista`
--
ALTER TABLE `entrevista`
  ADD CONSTRAINT `entrevista_ibfk_1` FOREIGN KEY (`id_persona`) REFERENCES `persona` (`id_persona`);

--
-- Constraints for table `evolucion`
--
ALTER TABLE `evolucion`
  ADD CONSTRAINT `evolucion_ibfk_1` FOREIGN KEY (`id_persona_creacion`) REFERENCES `persona` (`id_persona`),
  ADD CONSTRAINT `evolucion_ibfk_2` FOREIGN KEY (`id_tratamiento`) REFERENCES `tratamiento` (`id_tratamiento`);

--
-- Constraints for table `historia_clinica`
--
ALTER TABLE `historia_clinica`
  ADD CONSTRAINT `historia_clinica_ibfk_1` FOREIGN KEY (`id_persona_paciente`) REFERENCES `persona` (`id_persona`),
  ADD CONSTRAINT `historia_clinica_ibfk_2` FOREIGN KEY (`id_persona_creacion`) REFERENCES `persona` (`id_persona`);

--
-- Constraints for table `localidad`
--
ALTER TABLE `localidad`
  ADD CONSTRAINT `localidad_ibfk_1` FOREIGN KEY (`id_provincia`) REFERENCES `provincia` (`id_provincia`);

--
-- Constraints for table `patologia_profesional`
--
ALTER TABLE `patologia_profesional`
  ADD CONSTRAINT `patologia_profesional_ibfk_1` FOREIGN KEY (`id_persona`) REFERENCES `persona` (`id_persona`),
  ADD CONSTRAINT `patologia_profesional_ibfk_2` FOREIGN KEY (`id_patologia`) REFERENCES `patologia` (`id_patologia`);

--
-- Constraints for table `persona`
--
ALTER TABLE `persona`
  ADD CONSTRAINT `persona_ibfk_1` FOREIGN KEY (`id_tipo_persona`) REFERENCES `tipo_persona` (`id_tipo_persona`),
  ADD CONSTRAINT `persona_ibfk_2` FOREIGN KEY (`id_localidad`) REFERENCES `localidad` (`id_localidad`);

--
-- Constraints for table `tratamiento`
--
ALTER TABLE `tratamiento`
  ADD CONSTRAINT `tratamiento_ibfk_1` FOREIGN KEY (`id_historia_clinica`) REFERENCES `historia_clinica` (`id_historia_clinica`),
  ADD CONSTRAINT `tratamiento_ibfk_2` FOREIGN KEY (`id_patologia`) REFERENCES `patologia` (`id_patologia`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
