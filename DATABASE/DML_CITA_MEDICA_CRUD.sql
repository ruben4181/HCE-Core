use db_hce_core;

SET autocommit = 0;
SET SQL_SAFE_UPDATES = 0;

DROP PROCEDURE IF EXISTS getIdHCForDNI;
DROP PROCEDURE IF EXISTS get_Citas_Medicas_ForId;
DROP PROCEDURE IF EXISTS insertCitas_Medicas;
DROP PROCEDURE IF EXISTS updateCitas_Medicas;
DROP PROCEDURE IF EXISTS deleteCitas_Medicas;
DROP PROCEDURE IF EXISTS getMedicoForDNI;
DROP PROCEDURE IF EXISTS get_Examen_Fisico_ForId;
DROP PROCEDURE IF EXISTS insertExamen_Fisico;
DROP PROCEDURE IF EXISTS updateExamen_Fisico;
DROP PROCEDURE IF EXISTS deleteExamen_Fisico;
DROP PROCEDURE IF EXISTS get_Habito_ForId;
DROP PROCEDURE IF EXISTS insertHabito;
DROP PROCEDURE IF EXISTS updateHabito;
DROP PROCEDURE IF EXISTS deleteHabito;
DROP PROCEDURE IF EXISTS get_ExamenSegmentario_ForId;
DROP PROCEDURE IF EXISTS insertExamenSegmentario;
DROP PROCEDURE IF EXISTS updateExamenSegmentario;
DROP PROCEDURE IF EXISTS deleteExamenSegmentario;

-- OBTENER ID HISTORIA CLINICA DESDE DNI

DELIMITER //
CREATE PROCEDURE getIdHCForDNI (IN ID BIGINT)
BEGIN
	IF (SELECT EXISTS (SELECT DNI_PACIENTE FROM Historia_Clinica WHERE DNI_PACIENTE = ID)) THEN
		SELECT idHistoria "Id Historia Clinica"
		FROM Historia_Clinica
		WHERE DNI_PACIENTE = ID;
	ELSE
		SELECT 'NO EXISTE UNA HISTORIA CLINICA ASOCIADA CON ESE ID';
	END IF;
END //

-- OBTENER MEDICO POR DNI

DELIMITER //
CREATE PROCEDURE getMedicoForDNI (IN ID BIGINT)
BEGIN
	IF (SELECT EXISTS (SELECT DNI FROM Medicos WHERE DNI = ID)) THEN
		SELECT DNI "Identificación", nombreMedico "Nombre Medico"
		FROM Medicos
		WHERE DNI = ID;
	ELSE
		SELECT 'NO EXISTE EL MEDICO';
	END IF;
END //

-- EXAMEN FISICO

CREATE PROCEDURE get_Examen_Fisico_ForId (IN ID INT)
BEGIN
	IF (SELECT EXISTS (SELECT idExamen FROM Examen_Fisico WHERE idExamen = ID)) THEN
		SELECT idExamen "Id Examen", estadoConciencia "Estado Conciencia", lenguaje "Lenguaje", auditivo "Auditivo",
				 agudezaVisual "Agudeza Visual", peso "Peso",  estatura "Estatura", facie "Facie", 
                 edadRealAparente "Edad Real Aparente" ,temperatura "Temperatura", actitud "Actitud"
		FROM Examen_Fisico
		WHERE idExamen = ID;
	ELSE
		SELECT 'NO EXISTE EL EXAMEN FISICO CON ESE ID';
	END IF;
END //

DELIMITER //
CREATE PROCEDURE insertExamen_Fisico (IN ESTADOCONCIENCIA VARCHAR(200), IN LENGUAJE VARCHAR(200), IN AUDITIVO VARCHAR(200), IN AGUDEZAVISUAL VARCHAR(200), 
								IN PESO FLOAT(10), IN ESTATURA FLOAT(10), IN FACIE VARCHAR(200),IN  EDADREALAPATENTE VARCHAR(200), IN TEMPERATURA FLOAT(10),IN  ACTITUD VARCHAR(200))
BEGIN
	START TRANSACTION;
	INSERT INTO Examen_Fisico(estadoConciencia,  lenguaje,  auditivo, agudezaVisual, peso, estatura, facie, edadRealAparente, temperatura, actitud)
		VALUES(ESTADOCONCIENCIA, LENGUAJE, AUDITIVO, AGUDEZAVISUAL, PESO, ESTATURA ,FACIE, EDADREALAPATENTE, TEMPERATURA, ACTITUD);
	IF ROW_COUNT() > 0 THEN
		SELECT 'EL EXAMEN FISICO HA SIDO CREADO CON EXITO', (SELECT MAX(idExamen) FROM Examen_Fisico) "ID Examen";
		COMMIT;
	ELSE
		SELECT 'HUBO PROBLEMAS EN LA CREACIÓN DEL EXAMEN FISICO';
		ROLLBACK;
	END IF;
END //

DELIMITER //
CREATE PROCEDURE updateExamen_Fisico(IN ID INT, IN ESTADOCONCIENCIA VARCHAR(200), IN LENGUAJE VARCHAR(200), IN AUDITIVO VARCHAR(200), IN AGUDEZAVISUAL VARCHAR(200), 
								IN PESO FLOAT(10), IN ESTATURA FLOAT(10), IN FACIE VARCHAR(200),IN  EDADREALAPATENTE VARCHAR(200), IN TEMPERATURA FLOAT(10),IN  ACTITUD VARCHAR(200))
BEGIN
	IF (SELECT EXISTS (SELECT idExamen FROM Examen_Fisico WHERE idExamen = ID)) THEN 
		START TRANSACTION;
        UPDATE Examen_Fisico 
			SET 
			estadoConciencia = ESTADOCONCIENCIA , 
			lenguaje= LENGUAJE ,
			auditivo= AUDITIVO ,
			agudezaVisual= AGUDEZAVISUAL ,
			peso= PESO ,
			estatura= ESTATURA ,
			facie= FACIE ,
			edadRealAparente=  EDADREALAPATENTE ,
			temperatura= TEMPERATURA ,
			actitud=  ACTITUD WHERE idExamen = ID;
        IF ROW_COUNT() THEN
			SELECT 'EL EXAMEN MEDICO HA SIDO ACTUALIZADO';
            COMMIT;
		ELSE
			SELECT 'HUBO PROBLEMAS EN LA ACTUALIZACION DE DATOS';
			ROLLBACK;
		END IF;
	ELSE
		SELECT 'EL EXAMEN MEDICO NO EXISTE CON ESE ID';
	END IF;
END //

DELIMITER //
CREATE PROCEDURE deleteExamen_Fisico (IN ID INT)
BEGIN
	IF (SELECT EXISTS (SELECT idExamen FROM Examen_Fisico WHERE idExamen = ID)) THEN
		START TRANSACTION;
        DELETE FROM Examen_Fisico WHERE idExamen = ID;
        IF ROW_COUNT() THEN
			SELECT 'EL EXAMEN FUE ELIMINADO CON EXITO';
            COMMIT;
		ELSE
			SELECT 'HUBO PROBLEMAS AL BORRAR LOS DATOS';
            ROLLBACK;
		END IF;
	ELSE
		SELECT 'EL EXAMEN NO EXISTE CON ESE ID';
	END IF;
END //


-- HABITOS

DELIMITER //
CREATE PROCEDURE get_Habito_ForId (IN ID INT)
BEGIN
	IF (SELECT EXISTS (SELECT idHabito FROM Habitos WHERE idHabito = ID)) THEN
		SELECT idHabito "Id Habito", alimentacion "Alimentacion", sed "Sed", diuresis "Diuresis",catarsisintestinal "Catarsis intestinal",
			   sueno "Sueno",  relacionesSexuales "Relaciones Sexuales", alcohol "Alcohol", tabaco "Tabaco" ,drogas "Drogas", medicacion "Medicacion"
		FROM Habitos
		WHERE idHabito = ID;
	ELSE
		SELECT 'NO EXISTE EL HABITO  CON ESE ID';
	END IF;
END //

DELIMITER //
CREATE PROCEDURE insertHabito (IN ALIMENTACION VARCHAR(200),IN APETITO VARCHAR(200), IN SED VARCHAR(200), IN DIURESIS VARCHAR(200),
						 IN CATARSISINTESTINAL VARCHAR(200), IN SUENO VARCHAR(200), IN RELACIONESSEXUALES VARCHAR(200), IN ALCOHOL VARCHAR(200), IN TABACO VARCHAR(200),
						  IN DROGAS VARCHAR(200), IN MEDICACION VARCHAR(200))
BEGIN
	START TRANSACTION;
	INSERT INTO Habitos(alimentacion, apetito, sed, diuresis, catarsisintestinal, sueno, relacionesSexuales,
					alcohol, tabaco, drogas, medicacion)
		VALUES(ALIMENTACION, APETITO, SED, DIURESIS, CATARSISINTESTINAL, SUENO, RELACIONESSEXUALES,
				ALCOHOL, TABACO, DROGAS, MEDICACION);
	IF ROW_COUNT() > 0 THEN
		SELECT 'EL HABITO   HA SIDO CREADA CON EXITO', (SELECT MAX(idHabito) FROM Habitos) "ID Habito";
		COMMIT;
	ELSE
		SELECT 'HUBO PROBLEMAS EN LA CREACIÓN DEL HABITO  ';
		ROLLBACK;
	END IF;
END //

DELIMITER //
CREATE PROCEDURE updateHabito(IN ID INT,IN ALIMENTACION VARCHAR(200),IN APETITO VARCHAR(200), IN SED VARCHAR(200), IN  DIURESIS VARCHAR(200),
						 IN CATARSISINTESTINAL VARCHAR(200), IN SUENO VARCHAR(200), IN RELACIONESSEXUALES VARCHAR(200), IN ALCOHOL VARCHAR(200), IN TABACO VARCHAR(200),
						  IN DROGAS VARCHAR(200), IN MEDICACION VARCHAR(200))
BEGIN
	IF (SELECT EXISTS (SELECT idHabito FROM Habitos WHERE idHabito = ID)) THEN
		START TRANSACTION;
        UPDATE Habitos 
			SET idHabito = IDHABITO ,
			alimentacion = ALIMENTACION , 
			apetito= APETITO ,
			sed= SED ,
			diuresis = DIURESIS,
			catarsisintestinal= CATARSISINTESTINAL ,
			sueno= SUENO ,
			relacionesSexuales= RELACIONESSEXUALES ,
			alcohol= ALCOHOL ,
			tabaco=  TABACO ,
			drogas= DROGAS ,
			medicacion=  MEDICACION
		WHERE idHabito = ID;
        IF ROW_COUNT() THEN
			SELECT 'EL HABITO  HA SIDO ACTUALIZADO';
            COMMIT;
		ELSE
			SELECT 'HUBO PROBLEMAS EN LA ACTUALIZACION DE DATOS';
			ROLLBACK;
		END IF;
	ELSE
		SELECT 'EL HABITO  NO EXISTE CON ESE ID';
	END IF;
END //

DELIMITER //
CREATE PROCEDURE deleteHabito (IN ID INT)
BEGIN
	IF (SELECT EXISTS (SELECT idHabito FROM Habitos WHERE idHabito = ID) ) THEN
		START TRANSACTION;
        DELETE FROM Habitos WHERE idHabito = ID;
        IF ROW_COUNT() THEN
			SELECT 'EL HABITO  FUE ELIMINADO CON EXITO';
            COMMIT;
		ELSE
			SELECT 'HUBO PROBLEMAS AL BORRAR LOS DATOS';
            ROLLBACK;
		END IF;
	ELSE
		SELECT 'EL HABITO  NO EXISTE CON ESE ID';
	END IF;
END //

-- EXAMEN SEGMENTARIO

DELIMITER //
CREATE PROCEDURE get_ExamenSegmentario_ForId (IN ID INT)
BEGIN
	IF (SELECT EXISTS (SELECT idExamen FROM ExamenSegmentario WHERE idExamen = ID)) THEN
		SELECT idExamen "Id Examen", cabeza "Cabeza", cuello "Cuello",torax "Torax", AparatoCirculatorio "Aparato Circulatorio",
				AparatoRespiratorio " Aparato Respiratorio",  Abdomen "Abdomen",  AparatoUrogenital "Aparato Urogenital", 
				SistemaNervioso "Sistema Nervioso", psicologicoMental "Psicologico Mental" ,perine "Perine",
				examenGenital "Examen Genital ", miembrosSuperiores "Miembros Superiores", miembrosInferiores "Miembros Inferiores"  

		FROM ExamenSegmentario
		WHERE idExamen = ID;
	ELSE
		SELECT 'NO EXISTE EL EXAMEN SEGMENTARIO  CON ESE ID';
	END IF;
END //


DELIMITER //
CREATE PROCEDURE insertExamenSegmentario (IN CABEZA VARCHAR(200),IN CUELLO VARCHAR(200), IN TORAX VARCHAR(200), IN APARATOCIRCULATORIO VARCHAR(200),
	 					IN APARATORESPIRATORIO VARCHAR(200), IN ABDOMEN VARCHAR(200),	 
	 					IN APARATOUROGENITAL VARCHAR(200), IN SISTEMANERVIOSO VARCHAR(200), IN PSICOLOGICOMENTAL VARCHAR(200), IN PERINE VARCHAR(200),
						  IN EXAMENGENITAL VARCHAR(200), IN MIEMBROSSUPERIOES VARCHAR(200), IN MIEMBROSINFERIORES VARCHAR(200))
BEGIN
	START TRANSACTION;
	INSERT INTO ExamenSegmentario(cabeza,  cuello, torax,  AparatoCirculatorio,  AparatoRespiratorio,  Abdomen, 
       				 AparatoUrogenital,  SistemaNervioso,  psicologicoMental,  perine,  examenGenital, miembrosSuperiores, 
       				  miembrosInferiores)
	VALUES(CABEZA,  CUELLO, TORAX,  APARATOCIRCULATORIO,  APARATORESPIRATORIO,  ABDOMEN, 
					 APARATOUROGENITAL,  SISTEMANERVIOSO,  PSICOLOGICOMENTAL,  PERINE,  EXAMENGENITAL, 
					 MIEMBROSSUPERIOES,  MIEMBROSINFERIORES);
	IF ROW_COUNT() > 0 THEN
		SELECT 'EL EXAMEN SEGMENTARIO   HA SIDO CREADO CON EXITO', (SELECT MAX(idExamen) FROM ExamenSegmentario) "ID Examen Segmentario";
		COMMIT;
	ELSE
		SELECT 'HUBO PROBLEMAS EN LA CREACIÓN DEL EXAMEN SEGMENTARIO  ';
		ROLLBACK;
	END IF;
END //

DELIMITER //
CREATE PROCEDURE updateExamenSegmentario(IN ID INT,IN CABEZA VARCHAR(200),IN CUELLO VARCHAR(200), IN TORAX VARCHAR(200), IN APARATOCIRCULATORIO VARCHAR(200),
	 					IN APARATORESPIRATORIO VARCHAR(200), IN ABDOMEN VARCHAR(200),	 
	 					IN APARATOUROGENITAL VARCHAR(200), IN SISTEMANERVIOSO VARCHAR(200), IN PSICOLOGICOMENTAL VARCHAR(200), IN PERINE VARCHAR(200),
						  IN EXAMENGENITAL VARCHAR(200), IN MIEMBROSSUPERIOES VARCHAR(200), IN MIEMBROSINFERIORES VARCHAR(200))
BEGIN
	IF (SELECT EXISTS (SELECT idExamen FROM ExamenSegmentario WHERE idExamen = ID)) THEN 
		START TRANSACTION;
        UPDATE ExamenSegmentario 
			SET idExamen = IDEXAMEN ,
			cabeza = CABEZA , 
			cuello= CUELLO ,
			torax= TORAX ,
			AparatoCirculatorio = APARATOCIRCULATORIO,
			AparatoRespiratorio= APARATORESPIRATORIO ,
			Abdomen= ABDOMEN ,
			AparatoUrogenital= APARATOUROGENITAL ,
			SistemaNervioso= SISTEMANERVIOSO ,
			psicologicoMental=  PSICOLOGICOMENTAL ,
			perine= PERINE ,
			examenGenital=  EXAMENGENITAL,
			miembrosSuperiores= MIEMBROSSUPERIOES ,
			miembrosInferiores= MIEMBROSINFERIORES

		WHERE idExamen = ID;
        IF ROW_COUNT() THEN
			SELECT 'EL EXAMEN SEGMENTARIO  HA SIDO ACTUALIZADO';
            COMMIT;
		ELSE
			SELECT 'HUBO PROBLEMAS EN LA ACTUALIZACION DE DATOS';
			ROLLBACK;
		END IF;
	ELSE
		SELECT 'EL EXAMEN SEGMENTARIO  NO EXISTE CON ESE ID';
	END IF;
END //

DELIMITER //
CREATE PROCEDURE deleteExamenSegmentario (IN ID INT)
BEGIN
	IF (SELECT EXISTS (SELECT idExamen FROM ExamenSegmentario WHERE idExamen = ID) ) THEN
		START TRANSACTION;
        DELETE FROM ExamenSegmentario WHERE idExamen = ID;
        IF ROW_COUNT() THEN
			SELECT 'EL EXAMEN SEGMENTARIO  FUE ELIMINADO CON EXITO';
            COMMIT;
		ELSE
			SELECT 'HUBO PROBLEMAS AL BORRAR LOS DATOS';
            ROLLBACK;
		END IF;
	ELSE
		SELECT 'EL EXAMEN SEGMENTARIO  NO EXISTE CON ESE ID';
	END IF;
END //


-- CITA MEDICA

DELIMITER //
CREATE PROCEDURE get_Citas_Medicas_ForId (IN ID INT)
BEGIN
	IF (SELECT EXISTS (SELECT idConsulta FROM Citas_Medicas WHERE idConsulta = ID)) THEN
		SELECT idConsulta "Id Consulta", fecha "Fecha",motivo "Motivo", epsAgenda "agenda", Medicos_idMedico "Medicos_Idmedicos",
				Examen_Fisico_idExamen "Examen_Fisico_idExamen", Historia_Clinica_idHistoria "Historia_Clinica_idHistoria"
		FROM Citas_Medicas
		WHERE idConsulta = ID;
	ELSE
		SELECT 'NO EXISTE LA CITA MEDICA';
	END IF;
END //

DELIMITER //
CREATE PROCEDURE insertCitas_Medicas (IN FECHA TIMESTAMP,IN MOTIVO VARCHAR(200), IN EPSAGENDA INT,IN MEDICOS_IDMEDICOS INT,
								 IN EXAMEN_FISICO_IDEXAMEN INT, IN ID_HAB INT,IN ID_EX_SEG INT,IN HISTORIA_CLINICA_IDHISTORIA INT)
BEGIN
	START TRANSACTION;
	INSERT INTO Citas_Medicas(fecha ,motivo , epsAgenda , Medicos_idMedico ,Examen_Fisico_idExamen, 
							Habitos_idHabito,ExSegmentario_idExamen,Historia_Clinica_idHistoria )
		VALUES( FECHA , MOTIVO , EPSAGENDA , MEDICOS_IDMEDICOS ,
					EXAMEN_FISICO_IDEXAMEN ,ID_HAB, ID_EX_SEG,HISTORIA_CLINICA_IDHISTORIA );
	IF ROW_COUNT() > 0 THEN
		SELECT 'LA CITA MEDICA HA SIDO CREADA CON EXITO', (SELECT MAX(idConsulta) FROM Citas_Medicas) "Id Cita Medica"; 
		COMMIT;
	ELSE
		SELECT 'HUBO PROBLEMAS EN LA CREACIÓN DE LA CITA MEDICA';
		ROLLBACK;
	END IF;
END //

DELIMITER //
CREATE PROCEDURE updateCitas_Medicas(IN ID INT, IN FECHA TIMESTAMP,IN MOTIVO VARCHAR(200), IN EPSAGENDA INT,IN MEDICOS_IDMEDICOS INT,
								 IN EXAMEN_FISICO_IDEXAMEN INT, IN ID_HAB INT,IN ID_EX_SEG INT, IN HISTORIA_CLINICA_IDHISTORIA INT)
BEGIN
	IF (SELECT EXISTS (SELECT idConsulta FROM Citas_Medicas WHERE idConsulta = ID)) THEN
		START TRANSACTION;
        UPDATE Citas_Medicas 
			SET idConsulta = ID,
				fecha = FECHA,
				motivo= MOTIVO , 
				epsAgenda=EPSAGENDA , 
				Medicos_idMedico=MEDICOS_IDMEDICOS ,
				Examen_Fisico_idExamen= EXAMEN_FISICO_IDEXAMEN ,
                Habitos_idHabito  = ID_HAB,
                ExSegmentario_idExamen = ID_EX_SEG,
				Historia_Clinica_idHistoria= HISTORIA_CLINICA_IDHISTORIA
		WHERE idConsulta = ID;
        IF ROW_COUNT() THEN
			SELECT 'LA CITA MEDICA HA SIDO ACTUALIZADA';
            COMMIT;
		ELSE
			SELECT 'HUBO PROBLEMAS EN LA ACTUALIZACION DE DATOS';
			ROLLBACK;
		END IF;
	ELSE
		SELECT 'LA CITA MEDICA NO EXISTE CON ESE ID';
	END IF;
END //

DELIMITER //
CREATE PROCEDURE deleteCitas_Medicas (IN ID INT)
BEGIN
	IF (SELECT  EXISTS (SELECT idConsulta FROM Citas_Medicas WHERE idConsulta = ID))  THEN
		START TRANSACTION;
        DELETE FROM Citas_Medicas WHERE idConsulta = ID;
        IF ROW_COUNT() THEN
			SELECT 'LA CITA MEDICA FUE ELIMINADA CON EXITO';
            COMMIT;
		ELSE
			SELECT 'HUBO PROBLEMAS AL BORRAR LOS DATOS';
            ROLLBACK;
		END IF;
	ELSE
		SELECT 'LA CITA MEDICA NO EXISTE CON ESE ID';
	END IF;
END //
DELIMITER //

-- CALLS

-- CALL getMedicoForDNI(9491698);

-- CALL insertExamen_Fisico('SI','NO','NO','NO',14.5,14.5,'NO','NO',36.5,'NO');
-- CALL insertExamen_Fisico('SI','NO','NO','NO',14.5,14.5,'NO','NO',37.5,'NO');
-- CALL insertExamen_Fisico('SI','NO','NO','NO',14.5,14.5,'NO','NO',38.5,'NO');
-- CALL insertExamen_Fisico('SI','NO','NO','NO',14.5,14.5,'NO','NO',39.5,'NO');
-- CALL insertExamen_Fisico('SI','NO','NO','NO',14.5,14.5,'NO','NO',40.5,'NO');
-- CALL insertExamen_Fisico('SI','NO','NO','NO',14.5,14.5,'NO','NO',41.5,'NO');
-- CALL insertExamen_Fisico('SI','NO','NO','NO',14.5,14.5,'NO','NO',42.5,'NO');
-- CALL updateExamen_Fisico(5,'SI','NO','NO','NO',14.5,14.5,'NO','NO',88888.3,'NO');
-- CALL deleteExamen_Fisico(12);
-- CALL get_Examen_Fisico_ForId(10);

-- CALL insertHabito('NO','NO','NO','NO','NO','NO','NO','NO','NO','NO','NO');
-- CALL insertHabito('NO','NO','NO','NO','NO','NO','NO','NO','NO','NO','NO');
-- CALL insertHabito('NO','NO','NO','NO','NO','NO','NO','NO','NO','NO','NO');
-- CALL insertHabito('NO','NO','NO','NO','NO','NO','NO','NO','NO','NO','NO');
-- CALL insertHabito('NO','NO','NO','NO','NO','NO','NO','NO','NO','NO','NO');
-- CALL insertHabito('NO','NO','NO','NO','NO','NO','NO','NO','NO','NO','NO');
-- CALL get_Habito_ForId(19);
-- CALL updateHabito(1,'SI','NO','NO','NO','NO','NO','NO','NO','NO','NO','NO');
-- CALL deleteHabito(18);

-- CALL insertExamenSegmentario('NO','NO','NO','NO','NO','NO','NO','NO','NO','NO','NO','NO','NO');
-- CALL insertExamenSegmentario('NO','NO','NO','NO','NO','NO','NO','NO','NO','NO','NO','NO','NO');
-- CALL insertExamenSegmentario('NO','NO','NO','NO','NO','NO','NO','NO','NO','NO','NO','NO','NO');
-- CALL insertExamenSegmentario('NO','NO','NO','NO','NO','NO','NO','NO','NO','NO','NO','NO','NO');
-- CALL insertExamenSegmentario('NO','NO','NO','NO','NO','NO','NO','NO','NO','NO','NO','NO','NO');CALL insertExamenSegmentario('NO','NO','NO','NO','NO','NO','NO','NO','NO','NO','NO','NO','NO');
-- CALL get_ExamenSegmentario_ForId(1);
-- CALL updateExamenSegmentario(1,'SI','NO','NO','NO','NO','NO','NO','NO','NO','NO','NO','NO','NO');
-- CALL deleteExamenSegmentario(1);

-- CALL insertCitas_Medicas(sysdate(), 'SIDA', 1, 9491698, 1,1,1,1);
-- CALL get_Citas_Medicas_ForId(1);
-- CALL updateCitas_Medicas(1,sysdate(), 'MUERTE', 1, 9491698, 1,1,1,1);
-- CALL deleteCitas_Medicas(1);

SELECT * FROM Citas_Medicas;
