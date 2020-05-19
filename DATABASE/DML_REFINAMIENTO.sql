DROP PROCEDURE IF EXISTS getMedicamentos;
DROP PROCEDURE IF EXISTS getExamenesForIdDiagnostico;
DROP PROCEDURE IF EXISTS getMedicos;
DROP PROCEDURE IF EXISTS getTratamientos;
DROP PROCEDURE IF EXISTS getTipoExamenes;
DROP PROCEDURE IF EXISTS getMedsXTrataForId;
DROP PROCEDURE IF EXISTS getDiagXTratasForId;
DROP PROCEDURE IF EXISTS getDiagnosticosByIdCita;
DROP PROCEDURE IF EXISTS get_Citas;

DELIMITER //
CREATE PROCEDURE getMedicamentos()
BEGIN
  IF (SELECT EXISTS (SELECT idMedicamento FROM Medicamentos)) THEN
    SELECT idMedicamento "idMedicamento",
          nombreMedicamento "nombreMedicamento",
            gramaje "gramaje"
    FROM Medicamentos;
  ELSE
    SELECT 'NO HAY MEDICAMENTOS';
  END IF;
END // 

DELIMITER //
CREATE PROCEDURE getExamenesForIdDiagnostico (IN IDDIAG BIGINT)
BEGIN
  IF (SELECT EXISTS (SELECT idExamen FROM Examenes WHERE Diagnosticos_idDiagnostico = IDDIAG)) THEN
    SELECT idExamen "Id Examen",
        resumen "Resumen",
        resultados "Resultados",
        anexos "Anexos",
        TipoExamen_idTipoExamen "Id Tipo Examen",
        Diagnosticos_idDiagnostico "Id Diagnostico"
    FROM Examenes
    WHERE Diagnosticos_idDiagnostico = IDDIAG;
  ELSE
    SELECT 'NO EXISTE LOS EXAMENES';
  END IF;
END //

DELIMITER //
CREATE PROCEDURE getMedicos()
BEGIN
  IF (SELECT EXISTS (SELECT DNI FROM Medicos)) THEN
    SELECT nombreMedico "nombreMedico", DNI "DNI",
        fechaNacimiento "fechaNacimiento", telefono "telefono"
    FROM Medicos;
  ELSE
    SELECT 'NO EXISTEN MEDICOS REGISTRADOS';
  END IF;
END //

DELIMITER //
CREATE PROCEDURE getTratamientos()
BEGIN
  IF (SELECT EXISTS (SELECT idTratamiento FROM Tratamientos)) THEN
    SELECT concepto "concepto", idTratamiento "idTratamiento"
    FROM Tratamientos;
  ELSE
    SELECT 'NO HAY TRATAMIENTOS REGISTRADOS';
  END IF;
END // 

DELIMITER //
CREATE PROCEDURE getTipoExamenes()
BEGIN
  IF (SELECT EXISTS (SELECT idTipoExamen FROM TipoExamen)) THEN
    SELECT idTipoExamen "idTipoExamen",
        nombreTipo "nombreTipo"
    FROM TipoExamen;
  ELSE
    SELECT 'NO HAY TIPO EXAMENES REGISTRADOS';
  END IF;
END //

DELIMITER //
CREATE PROCEDURE getMedsXTrataForId (IN IDTratamiento BIGINT)
BEGIN
  IF (SELECT EXISTS (SELECT id FROM MedXTrata WHERE Tratamientos_idTratamiento = IDTratamiento)) THEN
    SELECT  Medicamentos_idMedicamento "Id Medicamento",
                RepeticionMed "Medicacion"
    FROM MedXTrata
    WHERE Tratamientos_idTratamiento = IDTratamiento;
  ELSE
    SELECT 'NO HAY MEDICAMENTOS PARA ESE TRATAMIENTO';
  END IF;
END // 

DELIMITER //
CREATE PROCEDURE getDiagXTratasForId (IN idDiag BIGINT)
BEGIN
  IF (SELECT EXISTS (SELECT id FROM DiagXTrata WHERE Diagnosticos_idDiagnostico = idDiag)) THEN
    SELECT  Tratamientos_idTratamiento "Id tratamiento"
    FROM DiagXTrata
    WHERE Diagnosticos_idDiagnostico = idDiag;
  ELSE
    SELECT 'NO HAY TRATAMIENTOS PARA ESE DIAGNOSTICO';
  END IF;
END // 

DELIMITER //
CREATE PROCEDURE getDiagnosticosByIdCita (IN IdCita BIGINT)
BEGIN
  IF (SELECT EXISTS (SELECT idDiagnostico FROM Diagnosticos WHERE Citas_Medicas_idConsulta = IdCita)) THEN
    SELECT idDiagnostico "Id Diagnostico",
        Diagnostico "Diagnostico"
    FROM Diagnosticos
    WHERE Citas_Medicas_idConsulta = IdCita;
  ELSE
    SELECT 'NO HAY NINGUN DIAGNOSTICO';
  END IF;
END //

DELIMITER //
CREATE PROCEDURE get_Citas (IN ID BIGINT)
BEGIN
  IF (SELECT EXISTS (SELECT idConsulta FROM Citas_Medicas WHERE Historia_Clinica_idHistoria = ID)) THEN
    SELECT idConsulta "idConsulta", fecha "fecha",motivo "motivo"
    FROM Citas_Medicas
    WHERE Historia_Clinica_idHistoria = ID;
  ELSE
    SELECT 'NO HAY CITAS MEDICAS';
  END IF;
END //