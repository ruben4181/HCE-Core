use db_hce_core;

SET autocommit = 0;

DROP PROCEDURE IF EXISTS getPacienteForDNI;

DROP PROCEDURE IF EXISTS getAcudienteForDni;

DROP PROCEDURE IF EXISTS getMedicoForDNI;

DROP PROCEDURE IF EXISTS insertAcudiente;

DROP PROCEDURE IF EXISTS insertPaciente;

DROP PROCEDURE IF EXISTS insertMedico;

DROP PROCEDURE IF EXISTS updateMedico;

DROP PROCEDURE IF EXISTS updatePaciente;

DROP PROCEDURE IF EXISTS updateTokenPaciente;

DROP PROCEDURE IF EXISTS updateAcudiente;

DROP PROCEDURE IF EXISTS deleteMedico;

DROP PROCEDURE IF EXISTS deletePaciente;

DROP PROCEDURE IF EXISTS deleteAcudiente;

DROP PROCEDURE IF EXISTS insertPacientesXAcudientes;

-- PACIENTES

DELIMITER //
CREATE PROCEDURE getPacienteForDNI (IN ID BIGINT) -- Get cliente by DNI
BEGIN
	IF (SELECT EXISTS (SELECT DNI FROM Pacientes WHERE DNI = ID)) THEN
		SELECT DNI "Identificación", nombreCliente "Nombre Paciente", 
				fechaNacimiento ,estadoCivil "Estado Civil", telefono "Telefono", sexo "Sexo", token "Token"
		FROM Pacientes
		WHERE DNI = ID;
	ELSE
		SELECT 'NO EXISTE EL PACIENTE';
	END IF;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE insertPaciente (IN ID BIGINT, IN NOMBRE VARCHAR(200), IN FECHA DATE, IN ESTADO_CIVIL VARCHAR(200),IN TELEFONO BIGINT, IN SEXO VARCHAR(200), IN TOKEN VARCHAR(200))
BEGIN
	IF (SELECT EXISTS (SELECT DNI FROM Pacientes WHERE DNI = ID)) THEN
		SELECT 'EL PACIENTE YA EXISTE';
	ELSE
		START TRANSACTION;
        INSERT INTO Pacientes(DNI, nombreCliente, fechaNacimiento, estadoCivil, telefono, sexo, token)
			VALUES(ID, NOMBRE, FECHA, ESTADO_CIVIL,TELEFONO, SEXO, TOKEN);
		IF ROW_COUNT() > 0 THEN
            SELECT 'EL PACIENTE HA SIDO CREADO CON EXITO', ID "ID Paciente";
            COMMIT;
		ELSE
			SELECT 'HUBO PROBLEMAS EN LA CREACIÓN DEL PACIENTE';
            ROLLBACK;
		END IF;
	END IF;
END //

DELIMITER //
CREATE PROCEDURE updatePaciente (IN ID_IN BIGINT, IN ID_CHANGE BIGINT, IN NOMBRE VARCHAR(200), IN FECHA DATE, IN ESTADO_CIVIL VARCHAR(200),IN TELEFONO BIGINT, IN SEXO VARCHAR(200), IN TOKEN VARCHAR(200))
BEGIN
	IF (SELECT EXISTS (SELECT DNI FROM Pacientes WHERE DNI = ID_IN)) THEN
		START TRANSACTION;
        UPDATE Pacientes 
			SET DNI = ID_CHANGE,
				nombreCliente = NOMBRE,
				fechaNacimiento = FECHA,
                estadoCivil = ESTADO_CIVIL,
                telefono = TELEFONO,
                sexo = SEXO,
                token = TOKEN
		WHERE DNI = ID_IN;
        IF ROW_COUNT() THEN
			SELECT 'EL PACIENTE HA SIDO ACTUALIZADO';
            COMMIT;
		ELSE
			SELECT 'HUBO PROBLEMAS EN LA ACTUALIZACION DE DATOS';
			ROLLBACK;
		END IF;
	ELSE
		SELECT 'EL PACIENTE NO EXISTE CON ESE ID';
	END IF;
END //

DELIMITER //
CREATE PROCEDURE updateTokenPaciente(IN ID BIGINT, IN TOKEN VARCHAR(200))
BEGIN
	IF (SELECT EXISTS (SELECT DNI FROM Pacientes WHERE DNI = ID)) THEN
		START TRANSACTION;
        UPDATE Pacientes SET token = TOKEN WHERE DNI = ID;
        IF ROW_COUNT() THEN
			SELECT 'EL PACIENTE HA SIDO ACTUALIZADO';
            COMMIT;
		ELSE
			SELECT 'HUBO PROBLEMAS EN LA ACTUALIZACION DE DATOS';
			ROLLBACK;
		END IF;
	ELSE
		SELECT 'EL PACIENTE NO EXISTE CON ESE ID';
	END IF;
END //

CREATE PROCEDURE deletePaciente (IN ID BIGINT)
BEGIN
	IF (SELECT EXISTS (SELECT DNI FROM Pacientes WHERE DNI = ID)) THEN
		START TRANSACTION;
        DELETE FROM Pacientes WHERE DNI = ID;
        IF ROW_COUNT() THEN
			SELECT 'EL PACIENTE FUE ELIMINADO CON EXITO';
            COMMIT;
		ELSE
			SELECT 'HUBO PROBLEMAS AL BORRAR LOS DATOS';
            ROLLBACK;
		END IF;
	ELSE
		SELECT 'EL PACIENTE NO EXISTE CON ESE ID';
	END IF;
END //

-- ACUDIENTES

DELIMITER //
CREATE PROCEDURE getAcudienteForDni (IN ID BIGINT)
BEGIN
	IF (SELECT EXISTS (SELECT DNI FROM Acudientes WHERE DNI = ID)) THEN
		SELECT nombreAcudiente "Nombre Acudiente", DNI "Identificación", fechaNacimiento ,
				telefono "Telefono", sexo "Sexo"
		FROM Acudientes
		WHERE DNI = ID;
	ELSE
		SELECT 'NO EXISTE EL ACUDIENTE';
	END IF;
END //

DELIMITER //
CREATE PROCEDURE insertAcudiente (IN ID BIGINT, IN NOMBRE VARCHAR(200), IN FECHA DATE, IN TELEFONO BIGINT, IN SEXO VARCHAR(200))
BEGIN
	IF (SELECT EXISTS (SELECT DNI FROM Acudientes WHERE DNI = ID)) THEN
		SELECT 'EL ACUDIENTE YA EXISTE';
	ELSE
		-- IF (SELECT EXISTS (SELECT idPaciente FROM Pacientes WHERE idPaciente = ))
		START TRANSACTION;
        INSERT INTO Acudientes(DNI, nombreAcudiente, fechaNacimiento, telefono, sexo)
			VALUES(ID, NOMBRE, FECHA, TELEFONO, SEXO);
		IF ROW_COUNT() > 0 THEN
			SELECT 'EL ACUDIENTE HA SIDO CREADO CON EXITO', ID "Id Acudiente";
            COMMIT;
        ELSE
			SELECT 'HUBO PROBLEMAS EN LA CREACIÓN DEL ACUDIENTE';
            ROLLBACK;
        END IF;
	END IF;
END //

DELIMITER //
CREATE PROCEDURE updateAcudiente (IN ID BIGINT, IN NOMBRE VARCHAR(200), IN FECHA DATE, IN TELEFONO BIGINT, IN SEXO VARCHAR(200))
BEGIN
	IF (SELECT EXISTS (SELECT DNI FROM Acudientes WHERE DNI = ID)) THEN
		START TRANSACTION;
        UPDATE Acudientes 
			SET DNI = ID, 
                nombreAcudiente = NOMBRE, 
                fechaNacimiento = FECHA, 
                telefono = TELEFONO, 
                sexo = SEXO
		WHERE DNI = ID;
        IF ROW_COUNT() THEN
			SELECT 'EL ACUDIENTE HA SIDO ACTUALIZADO';
            COMMIT;
		ELSE
			SELECT 'HUBO PROBLEMAS EN LA ACTUALIZACION DE DATOS';
			ROLLBACK;
		END IF;
	ELSE
		SELECT 'EL ACUDIENTE NO EXISTE CON ESE ID';
	END IF;
END //

CREATE PROCEDURE deleteAcudiente (IN ID BIGINT)
BEGIN
	IF (SELECT EXISTS (SELECT DNI FROM Acudientes WHERE DNI = ID)) THEN
		START TRANSACTION;
        DELETE FROM Acudientes WHERE DNI = ID;
        IF ROW_COUNT() THEN
			SELECT 'EL ACUDIENTE FUE ELIMINADA CON EXITO';
            COMMIT;
		ELSE
			SELECT 'HUBO PROBLEMAS AL BORRAR LOS DATOS';
            ROLLBACK;
		END IF;
	ELSE
		SELECT 'EL ACUDIENTE NO EXISTE CON ESE ID';
	END IF;
END //

-- MEDICOS

DELIMITER //
CREATE PROCEDURE getMedicoForDNI (IN ID BIGINT)
BEGIN
	IF (SELECT EXISTS (SELECT DNI FROM Medicos WHERE DNI = ID)) THEN
		SELECT nombreMedico "Nombre Medico", DNI "Identificación",
				fechaNacimiento "Fecha Nacimiento", telefono "Telefono"
		FROM Medicos
		WHERE DNI = ID;
	ELSE
		SELECT 'NO EXISTE EL MEDICO';
	END IF;
END //

DELIMITER //
CREATE PROCEDURE insertMedico (IN ID BIGINT, IN NOMBRE VARCHAR(200), IN FECHA DATE, IN TELEFONO BIGINT)
BEGIN
	IF (SELECT EXISTS (SELECT DNI FROM Medicos WHERE DNI = ID)) THEN
		SELECT 'EL MEDICO YA EXISTE';
	ELSE
		START TRANSACTION;
        INSERT INTO Medicos(DNI, nombreMedico, fechaNacimiento, telefono)
			VALUES(ID, NOMBRE, FECHA,TELEFONO);
		IF ROW_COUNT() > 0 THEN
			SELECT 'EL MEDICO HA SIDO CREADO CON EXITO', ID "Identificación";
            COMMIT;
        ELSE
			SELECT 'HUBO PROBLEMAS EN LA CREACIÓN DEL MEDICO';
			ROLLBACK;
        END IF;
	END IF;
END //

DELIMITER //
CREATE PROCEDURE updateMedico (IN ID BIGINT, IN NOMBRE VARCHAR(200), IN FECHA DATE, IN TELEFONO BIGINT)
BEGIN
	IF (SELECT EXISTS (SELECT DNI FROM Medicos WHERE DNI = ID)) THEN
		START TRANSACTION;
        UPDATE Medicos
			SET DNI = ID,
				nombreMedico = NOMBRE,
                fechaNacimiento = FECHA,
                telefono = TELEFONO
		WHERE DNI = ID;
        IF ROW_COUNT() THEN
			SELECT 'EL MEDICO HA SIDO ACTUALIZADA';
            COMMIT;
		ELSE
			SELECT 'HUBO PROBLEMAS EN LA ACTUALIZACION DE DATOS';
			ROLLBACK;
		END IF;
	ELSE
		SELECT 'EL MEDICO NO EXISTE CON ESE ID';
	END IF;
END //

DELIMITER //
CREATE PROCEDURE deleteMedico (IN ID BIGINT)
BEGIN
	IF (SELECT EXISTS (SELECT DNI FROM Medicos WHERE DNI = ID)) THEN
        DELETE FROM Medicos WHERE DNI=ID;
        IF ROW_COUNT() THEN
			SELECT 'EL MEDICO FUE ELIMINADO CON EXITO';
            COMMIT;
		ELSE
			SELECT 'HUBO PROBLEMAS AL BORRAR LOS DATOS';
            ROLLBACK;
		END IF;
	ELSE
		SELECT 'EL MEDICO NO EXISTE CON ESE ID';
	END IF;
END //

-- PACIENTES X ACUDIENTES
DELIMITER //
CREATE PROCEDURE insertPacientesXAcudientes (IN IDPACIENTE BIGINT,IN IDACUDIENTE BIGINT)
BEGIN
	START TRANSACTION;
	INSERT INTO AcudientesXPacientes( DNIPACIENTE, DNIACUDIENTE)
		VALUES(IDPACIENTE, IDACUDIENTE);
	IF ROW_COUNT() > 0 THEN
		SELECT 'INSERCCIÓN COMPLETADA';
		COMMIT;
	ELSE
		SELECT 'HUBO PROBLEMAS EN LA INSERCCIÓN DE DATOS';
		ROLLBACK;
	END IF;
END //

-- Calls To Procedure
CALL insertPaciente(1144100868, "CARLOS", '1998-02-28','VIUDO',6151651,'masculino','ey1eu9');
CALL insertPaciente(1144105896, "JUAN", '1998-02-18','MORTAL',2657891345,'masculino','ejhhbfau');
-- CALL getPacienteForDni(1144100868);
-- CALL getPacienteForDni(1144105896);
-- CALL updatePaciente(1144100868, 1144100868,"JAIME", '1998-02-28','VIUDO',6565165165,'masculino','ey1eu9');
-- CALL updateTokenPaciente(1144100868,'adsads');
-- CALL deletePaciente(1144100868);

CALL insertAcudiente(16802551, 'RAMIRO' , '1972-08-30', 3022405655, 'MASCULINO');
CALL insertAcudiente(66678978, 'CARLOS' , '1972-06-30', 3022405635, 'FEMENINO');
CALL insertAcudiente(9191, 'ROBERTO' , '1972-06-30', 611198191, 'FEMENINO');
-- CALL getAcudienteForDni(9191);
-- CALL getAcudienteForDni(66678978);
-- CALL updateAcudiente(66678978,'MANUEL' , '1972-08-30', 4567298137, 'MASCULINO');
-- CALL deleteAcudiente(66678978);

CALL insertMedico(9491698,'JAIME', '1972-08-30', 981916498);
CALL insertMedico(651919619,'MORIARTI', '1972-08-30', 6486);
-- CALL getMedicoForDNI(651919619);
-- CALL updateMedico(651919619,'MORIARTI', '1972-08-30', 629198);
-- CALL deleteMedico(9491698);

CALL insertPacientesXAcudientes(1144100868,9191);

