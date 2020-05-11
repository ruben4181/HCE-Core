use db_hce_core;

SET autocommit = 0;

DROP PROCEDURE IF EXISTS getAntecedenteForId;

DROP PROCEDURE IF EXISTS getFisiologicaForId;

DROP PROCEDURE IF EXISTS getEntidadForId;

DROP PROCEDURE IF EXISTS getHCForId;

DROP PROCEDURE IF EXISTS getHCForIdPaciente;

DROP PROCEDURE IF EXISTS insertHC;

DROP PROCEDURE IF EXISTS insertEntidad;

DROP PROCEDURE IF EXISTS insertFisiologica;

DROP PROCEDURE IF EXISTS insertAntecedentes;

DROP PROCEDURE IF EXISTS updateTokenEntidad;

DROP PROCEDURE IF EXISTS updateEntidad;

DROP PROCEDURE IF EXISTS updateHC;

DROP PROCEDURE IF EXISTS updateAntecedentes;

DROP PROCEDURE IF EXISTS updateFisiologica;

DROP PROCEDURE IF EXISTS deleteEntidad;

DROP PROCEDURE IF EXISTS deleteHC;

DROP PROCEDURE IF EXISTS deleteFisiologica;

DROP PROCEDURE IF EXISTS deleteAntecedentes;

DROP PROCEDURE IF EXISTS getHCForIdPaciente;

DROP PROCEDURE IF EXISTS getHCForIdPaciente;

-- FISIOLOGICA

DELIMITER //
CREATE PROCEDURE getFisiologicaForId (IN ID INT)
BEGIN
	IF (SELECT EXISTS (SELECT idFisiologica FROM Fisiologica WHERE idFisiologica = ID)) THEN
		SELECT idFisiologica "Id Fisiologica", lactancia "Lactancia", iniciacionSexual "Iniciacion Sexual",
				ginecoObstretico "Gineco Obstretico", menarca "Menarca", embarazos "Embarazos",
                partos "Partos", abortos "Abortos"
		FROM Fisiologica
		WHERE idFisiologica = ID;
	ELSE
		SELECT 'NO EXISTE LA FISIOLOGICA';
	END IF;
END // 

DELIMITER //
CREATE PROCEDURE insertFisiologica (IN ID INT, IN LACTANCIA VARCHAR(200), IN INI_SEXUAL VARCHAR(200), IN GINECO VARCHAR(200),
										IN MENARCA VARCHAR(200), IN EMBARAZOS VARCHAR(200), IN PARTOS VARCHAR(200), IN ABORTOS VARCHAR(200))
BEGIN
	IF (SELECT EXISTS (SELECT idFisiologica FROM Fisiologica WHERE idFisiologica = ID)) THEN
		SELECT 'LA FISIOLOGICA YA EXISTE CON ESE ID';
	ELSE
		START TRANSACTION;
        INSERT INTO Fisiologica(idFisiologica, lactancia, iniciacionSexual, ginecoObstretico, menarca, embarazos, partos, abortos)
			VALUES(ID, LACTANCIA, INI_SEXUAL, GINECO, MENARCA, EMBARAZOS, PARTOS, ABORTOS);
		IF ROW_COUNT() > 0 THEN
			SELECT 'LA FISIOLOGIA HA SIDO CREADA CON EXITO', ID "Id Fisiologica";
            COMMIT;
		ELSE
			SELECT 'HUBO PROBLEMAS EN LA CREACIÓN DE LA FISIOLOGIA';
			ROLLBACK;
		END IF;
	END IF;
END //

DELIMITER //
CREATE PROCEDURE updateFisiologica (IN ID INT, IN LACTANCIA VARCHAR(200), IN INI_SEXUAL VARCHAR(200), IN GINECO VARCHAR(200),
										IN MENARCA VARCHAR(200), IN EMBARAZOS VARCHAR(200), IN PARTOS VARCHAR(200), IN ABORTOS VARCHAR(200))
BEGIN
	IF (SELECT EXISTS (SELECT idFisiologica FROM Fisiologica WHERE idFisiologica = ID)) THEN
		START TRANSACTION;
        UPDATE Fisiologica 
			SET idFisiologica = ID, 
				lactancia = LACTANCIA, 
                iniciacionSexual = INI_SEXUAL, 
                ginecoObstretico = GINECO, 
				menarca = MENARCA, 
                embarazos = EMBARAZOS, 
                partos = PARTOS, 
                abortos = ABORTOS
		WHERE idFisiologica = ID;
        IF ROW_COUNT() THEN
			SELECT 'LA FISIOLOGICA HA SIDO ACTUALIZADA';
            COMMIT;
		ELSE
			SELECT 'HUBO PROBLEMAS EN LA ACTUALIZACION DE DATOS';
			ROLLBACK;
		END IF;
	ELSE
		SELECT 'LA FISIOLOGICA NO EXISTE CON ESE ID';
	END IF;
END //

DELIMITER //
CREATE PROCEDURE deleteFisiologica (IN ID INT)
BEGIN
	IF (SELECT EXISTS (SELECT idFisiologica FROM Fisiologica WHERE idFisiologica = ID)) THEN
		START TRANSACTION;
        DELETE FROM Fisiologica WHERE idFisiologica = ID;
        IF ROW_COUNT() THEN
			SELECT 'LA FISIOLOGICA FUE ELIMINADA CON EXITO';
            COMMIT;
		ELSE
			SELECT 'HUBO PROBLEMAS AL BORRAR LOS DATOS';
            ROLLBACK;
		END IF;
	ELSE
		SELECT 'LA FISIOLOGICA NO EXISTE CON ESE ID';
	END IF;
END //

-- ANTECEDENTES

DELIMITER //
CREATE PROCEDURE getAntecedenteForId (IN ID INT)
BEGIN
	IF (SELECT EXISTS (SELECT idAntecedente FROM Antecedentes WHERE idAntecedente = ID)) THEN
		SELECT idAntecedente "Id Antecedente", accidentes "Accidentes", antecedentesHereditarios "Antecedentes Hereditarios",
				enfermedadesInfancia "Enfermedades Infancia", intervencionesQuirurgicas "Intervencion Quirurgicas",
                alergias "Alergias", inmunizacion "Inmunizacion"
		FROM Antecedentes
		WHERE idAntecedente = ID;
	ELSE
		SELECT 'NO EXISTE EL ANTECEDENTE';
	END IF;
END //

DELIMITER //
CREATE PROCEDURE insertAntecedentes (IN ID INT, IN ACCIDENTES VARCHAR(200), IN ANT_HERE VARCHAR(200), IN ENF_INF VARCHAR(200),
										IN INT_QUIRUR VARCHAR(200), IN ALERGIAS VARCHAR(200), IN INMUNIZACION VARCHAR(200))
BEGIN
	IF (SELECT EXISTS (SELECT idAntecedente FROM Antecedentes WHERE idAntecedente = ID)) THEN
		SELECT 'EL ANTECEDENTE YA EXISTE CON ESE ID';
	ELSE
		START TRANSACTION;
        INSERT INTO Antecedentes(idAntecedente, accidentes, antecedentesHereditarios, enfermedadesInfancia, intervencionesQuirurgicas, alergias, inmunizacion)
			VALUES(ID, ACCIDENTES, ANT_HERE, ENF_INF, INT_QUIRUR, ALERGIAS, INMUNIZACION);
		IF ROW_COUNT() > 0 THEN
			SELECT 'EL ANTECEDENTE HA SIDO CREADO CON EXITO', ID "Id Antecedente";
            COMMIT;
		ELSE
			SELECT 'HUBO PROBLEMAS EN LA CREACIÓN DE LA FISIOLOGIA';
			ROLLBACK;
		END IF;
	END IF;
END //

DELIMITER //
CREATE PROCEDURE updateAntecedentes (IN ID INT, IN ACCIDENTES VARCHAR(200), IN ANT_HERE VARCHAR(200), IN ENF_INF VARCHAR(200),
										IN INT_QUIRUR VARCHAR(200), IN ALERGIAS VARCHAR(200), IN INMUNIZACION VARCHAR(200))
BEGIN
	IF (SELECT EXISTS (SELECT idAntecedente FROM Antecedentes WHERE idAntecedente = ID)) THEN
		START TRANSACTION;
        UPDATE Antecedentes 
			SET idAntecedente = ID, 
				accidentes = ACCIDENTES, 
                antecedentesHereditarios = ANT_HERE, 
                enfermedadesInfancia = ENF_INF, 
                intervencionesQuirurgicas = INT_QUIRUR, 
                alergias = ALERGIAS, 
                inmunizacion = INMUNIZACION
		WHERE idAntecedente = ID;
        IF ROW_COUNT() THEN
			SELECT 'EL ANTECEDENTE HA SIDO ACTUALIZADO';
            COMMIT;
		ELSE
			SELECT 'HUBO PROBLEMAS EN LA ACTUALIZACION DE DATOS';
			ROLLBACK;
		END IF;
	ELSE
		SELECT 'EL ANTECEDENTE NO EXISTE CON ESE ID';
	END IF;
END //

DELIMITER //
CREATE PROCEDURE deleteAntecedentes (IN ID INT)
BEGIN
	IF (SELECT EXISTS (SELECT idAntecedente FROM Antecedentes WHERE idAntecedente = ID)) THEN
		START TRANSACTION;
        DELETE FROM Antecedentes WHERE idAntecedente = ID;
        IF ROW_COUNT() THEN
			SELECT 'EL ANTECEDENTE FUE ELIMINADO CON EXITO';
            COMMIT;
		ELSE
			SELECT 'HUBO PROBLEMAS AL BORRAR LOS DATOS';
            ROLLBACK;
		END IF;
	ELSE
		SELECT 'EL ANTECEDENTE NO EXISTE CON ESE ID';
	END IF;
END //

-- ENTIDAD

DELIMITER //
CREATE PROCEDURE getEntidadForId (IN ID INT)
BEGIN
	IF (SELECT EXISTS (SELECT idEntidad FROM Entidad WHERE idEntidad = ID)) THEN
		SELECT idEntidad "Identificación", nombreEntidad "Nombre Entidad", 
				token "Token"
		FROM Entidad
		WHERE idEntidad = ID;
	ELSE
		SELECT 'NO EXISTE LA ENTIDAD';
	END IF;
END //

DELIMITER //
CREATE PROCEDURE insertEntidad (IN ID_ENTIDAD INT, IN NOMBRE_ENTIDAD VARCHAR(200), IN TOKEN VARCHAR(200))
BEGIN
	IF (SELECT EXISTS (SELECT idEntidad FROM Entidad WHERE idEntidad = ID_ENTIDAD)) THEN
		SELECT 'LA ENTIDAD YA EXISTE CON ESE ID';
	ELSE
		START TRANSACTION;
        INSERT INTO Entidad(idEntidad, nombreEntidad, token)
			VALUES(ID_ENTIDAD, NOMBRE_ENTIDAD, TOKEN);
		IF ROW_COUNT() > 0 THEN
			SELECT 'LA ENTIDAD HA SIDO CREADA CON EXITO';
            COMMIT;
		ELSE
			SELECT 'HUBO PROBLEMAS EN LA CREACIÓN DE LA ENTIDAD';
			ROLLBACK;
		END IF;
	END IF;
END //

DELIMITER //
CREATE PROCEDURE updateEntidad (IN ID INT, IN NOMBRE_ENTIDAD VARCHAR(200), IN TOKEN VARCHAR(200))
BEGIN
	IF (SELECT EXISTS (SELECT idEntidad FROM Entidad WHERE idEntidad = ID)) THEN
		START TRANSACTION;
        UPDATE Entidad 
			SET idEntidad = ID,
				nombreEntidad = NOMBRE_ENTIDAD,
				token = TOKEN 
		WHERE idEntidad = ID;
        IF ROW_COUNT() THEN
			SELECT 'LA ENTIDAD HA SIDO ACTUALIZADA';
            COMMIT;
		ELSE
			SELECT 'HUBO PROBLEMAS EN LA ACTUALIZACION DE DATOS';
			ROLLBACK;
		END IF;
	ELSE
		SELECT 'LA ENTIDAD NO EXISTE CON ESE ID';
	END IF;
END //

DELIMITER //
CREATE PROCEDURE updateTokenEntidad(IN ID INT, IN TOKEN VARCHAR(200))
BEGIN
	IF (SELECT EXISTS (SELECT idEntidad FROM Entidad WHERE idEntidad = ID)) THEN
		START TRANSACTION;
        UPDATE Entidad SET token = TOKEN WHERE idEntidad = ID;
        IF ROW_COUNT() THEN
			SELECT 'LA ENTIDAD HA SIDO ACTUALIZADA';
            COMMIT;
		ELSE
			SELECT 'HUBO PROBLEMAS EN LA ACTUALIZACION DE DATOS';
			ROLLBACK;
		END IF;
	ELSE
		SELECT 'LA ENTIDAD NO EXISTE CON ESE ID';
	END IF;
END //

DELIMITER //
CREATE PROCEDURE deleteEntidad (IN ID INT)
BEGIN
	IF (SELECT EXISTS (SELECT idEntidad FROM Entidad WHERE idEntidad = ID)) THEN
		START TRANSACTION;
        DELETE FROM Entidad WHERE idEntidad = ID;
        IF ROW_COUNT() THEN
			SELECT 'LA ENTIDAD FUE ELIMINADA CON EXITO';
            COMMIT;
		ELSE
			SELECT 'HUBO PROBLEMAS AL BORRAR LOS DATOS';
            ROLLBACK;
		END IF;
	ELSE
		SELECT 'LA ENTIDAD NO EXISTE CON ESE ID';
	END IF;
END //


-- HISTORIA CLINICA

DELIMITER //
CREATE PROCEDURE getHCForIdPaciente (IN ID BIGINT)
BEGIN
	IF (SELECT EXISTS (SELECT DNI_PACIENTE FROM Historia_Clinica WHERE DNI_PACIENTE = ID)) THEN
		SELECT idHistoria "Id Historia Clinica", Entidad_idEntidad "Id Identidad", 
				Antecedentes_idAntecedente "Id Antecedente", Fisiologica_IdFisiologica "Id Fisiologica",
                DNI_PACIENTE "Identifiación Paciente"
		FROM Historia_Clinica
		WHERE DNI_PACIENTE = ID;
	ELSE
		SELECT 'NO EXISTE UNA HISTORIA CLINICA ASOCIADA CON ESE ID';
	END IF;
END //

DELIMITER //
CREATE PROCEDURE getHCForId (IN ID INT)
BEGIN
	IF (SELECT EXISTS (SELECT idHistoria FROM Historia_Clinica WHERE idHistoria = ID)) THEN
		SELECT idHistoria "Identificación", Entidad_idEntidad "Id Identidad", 
				Antecedentes_idAntecedente "Id Antecedente", Fisiologica_IdFisiologica "Id Fisiologica",
                DNI_PACIENTE "Id Paciente", DNI_PACIENTE "Identifiación Paciente"
		FROM Historia_Clinica
		WHERE idHistoria = ID;
	ELSE
		SELECT 'NO EXISTE LA HISTORIA CLINICA';
	END IF;
END //

DELIMITER //
CREATE PROCEDURE insertHC (IN ID_ENTIDAD INTEGER, IN ID_ANTECEDENTE INTEGER, IN ID_FISIOLOGICA INTEGER, IN ID_PACIENTE BIGINT)
BEGIN
	IF (SELECT EXISTS (SELECT idHistoria FROM Historia_Clinica WHERE DNI_PACIENTE = ID_PACIENTE)) THEN
		SELECT 'LA HISTORIA CLINICA YA EXISTE CON ESE ID DE PACIENTE';
	ELSE
		START TRANSACTION;
        INSERT INTO Historia_Clinica(Entidad_idEntidad, Antecedentes_idAntecedente, Fisiologica_IdFisiologica, DNI_PACIENTE)
			VALUES(ID_ENTIDAD, ID_ANTECEDENTE,ID_FISIOLOGICA, ID_PACIENTE);
		IF ROW_COUNT() > 0 THEN
			SELECT 'LA HISTORIA CLINICA HA SIDO CREADO CON EXITO', (SELECT idHistoria FROM Historia_Clinica WHERE DNI_PACIENTE = ID_PACIENTE) "ID HISTORIA";
            COMMIT;
		ELSE
			SELECT 'HUBO PROBLEMAS EN LA CREACIÓN DE LA HISTORIA CLINICA';
			ROLLBACK;
		END IF;
	END IF;
END //

DELIMITER //
CREATE PROCEDURE updateHC (IN ID INT, IN ID_ENTIDAD INTEGER, IN ID_ANTECEDENTE INTEGER, IN ID_FISIOLOGICA INTEGER, IN ID_PACIENTE BIGINT)
BEGIN
	IF (SELECT EXISTS (SELECT idHistoria FROM Historia_Clinica WHERE idHistoria = ID)) THEN
		START TRANSACTION;
        UPDATE Acudientes 
			SET  idHistoria = ID,
				Entidad_idEntidad = ID_ENTIDAD, 
                Antecedentes_idAntecedente = ID_ANTECEDENTE, 
                Fisiologica_IdFisiologica = ID_FISIOLOGICA, 
                DNI_PACIENTE = ID_PACIENTE
		WHERE idHistoria = ID;
        IF ROW_COUNT() THEN
			SELECT 'LA HISTORIA CLINICA HA SIDO ACTUALIZADA';
            COMMIT;
		ELSE
			SELECT 'HUBO PROBLEMAS EN LA ACTUALIZACION DE DATOS';
			ROLLBACK;
		END IF;
	ELSE
		SELECT 'LA HISTORIA CLINICA NO EXISTE CON ESE ID';
	END IF;
END //

CREATE PROCEDURE deleteHC (IN ID INT)
BEGIN
	IF (SELECT EXISTS (SELECT idHistoria FROM Historia_Clinica WHERE idHistoria = ID)) THEN
		START TRANSACTION;
        DELETE FROM Historia_Clinica WHERE idHistoria = ID;
        IF ROW_COUNT() THEN
			SELECT 'LA HISTORIA CLINICA FUE ELIMINADA CON EXITO';
            COMMIT;
		ELSE
			SELECT 'HUBO PROBLEMAS AL BORRAR LOS DATOS';
            ROLLBACK;
		END IF;
	ELSE
		SELECT 'LA HISTORIA CLINICA NO EXISTE CON ESE ID';
	END IF;
END //

-- CALL PROCEDURES

-- CALL insertFisiologica(1,'NO APLICA','NO APLICA','NO APLICA','NO APLICA','NO APLICA','NO APLICA','NO APLICA');
-- CALL insertFisiologica(2,'NO APLICA','NO APLICA','NO APLICA','APLICA','NO APLICA','NO APLICA','NO APLICA');
-- CALL getFisiologicaForId(2);
-- CALL updateFisiologica(2,'APLICA','NO APLICA','NO APLICA','APLICA','NO APLICA','NO APLICA','NO APLICA')
-- CALL deleteFisiologica(2);

-- CALL insertAntecedentes(1, 'SI', 'SI', 'SI', 'SI', 'SI', 'SI');
-- CALL insertAntecedentes(2, 'NO', 'NO', 'NO', 'NO', 'NO', 'NO');
-- CALL getAntecedenteForId(1);
-- CALL updateAntecedentes(2,'SI', 'NO', 'NO', 'NO', 'NO', 'NO');
-- CALL deleteAntecedentes(1);

-- CALL insertEntidad(1,'SURA','askd asjda');
-- CALL insertEntidad(2,'AMERICANA','askd asjda');
-- CALL getEntidadForId(1);
-- CALL updateEntidad(1,'SURA','sdas');
-- CALL updateTokenEntidad(1,'sadasfasf');
-- select * from historia_clinica;

-- CALL insertHC(1,1,1,1144100868);
-- CALL deleteHC(5);




