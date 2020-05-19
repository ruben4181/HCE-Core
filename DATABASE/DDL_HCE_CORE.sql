show databases;

--use db_hce_core;

-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2020-04-13 20:55:18.296

-- DROPS
DROP TABLE DiagXTrata CASCADE;
DROP TABLE Examenes CASCADE;
DROP TABLE MedXTrata CASCADE;
DROP TABLE Tratamientos CASCADE;
DROP TABLE Diagnosticos CASCADE;
DROP TABLE Medicamentos CASCADE;
DROP TABLE TipoExamen CASCADE;
DROP TABLE Citas_Medicas CASCADE;
DROP TABLE ExamenSegmentario CASCADE;
DROP TABLE Examen_Fisico CASCADE;
DROP TABLE Habitos CASCADE;
DROP TABLE Medicos CASCADE;
DROP TABLE Historia_Clinica CASCADE;
DROP TABLE Antecedentes CASCADE;
DROP TABLE Entidad CASCADE;
DROP TABLE Fisiologica CASCADE;
DROP TABLE AcudientesXPacientes CASCADE;
DROP TABLE Pacientes CASCADE;
DROP TABLE Acudientes CASCADE;

-- tables
-- Table: Acudientes
CREATE TABLE Acudientes (
    DNI BIGINT,
    nombreAcudiente varchar(200) NOT NULL,
    fechaNacimiento date NOT NULL,
    telefono BIGINT NOT NULL,
    sexo varchar(200) NOT NULL,
    CONSTRAINT Acudientes_pk PRIMARY KEY (DNI)
);

-- Table: AcudientesXPacientes
CREATE TABLE AcudientesXPacientes(
	id BIGINT NOT NULL AUTO_INCREMENT,
    DNIPACIENTE BIGINT,
    DNIACUDIENTE BIGINT,
    CONSTRAINT id_Pk PRIMARY KEY (id)
);

-- Table: Antecedentes
CREATE TABLE Antecedentes (
    idAntecedente BIGINT NOT NULL,
    accidentes varchar(200) NOT NULL,
    antecedentesHereditarios varchar(200) NOT NULL,
    enfermedadesInfancia varchar(200) NOT NULL,
    BIGINTervencionesQuirurgicas varchar(200) NOT NULL,
    alergias varchar(200) NOT NULL,
    inmunizacion varchar(200) NOT NULL,
    CONSTRAINT Antecedentes_pk PRIMARY KEY (idAntecedente)
);

-- Table: Citas_Medicas
CREATE TABLE Citas_Medicas (
    idConsulta BIGINT NOT NULL AUTO_INCREMENT,
    fecha timestamp NOT NULL,
    motivo varchar(200) NOT NULL,
    epsAgenda BIGINT NOT NULL,
    Medicos_idMedico BIGINT NOT NULL,
    Examen_Fisico_idExamen BIGINT NOT NULL,
    Habitos_idHabito BIGINT NOT NULL,
    ExSegmentario_idExamen BIGINT NOT NULL,
    Historia_Clinica_idHistoria BIGINT NOT NULL,
    CONSTRAINT Citas_Medicas_pk PRIMARY KEY (idConsulta)
);

-- Table: DiagXTrata
CREATE TABLE DiagXTrata (
    Id BIGINT NOT NULL AUTO_INCREMENT,
    Diagnosticos_idDiagnostico BIGINT NOT NULL,
    Tratamientos_idTratamiento BIGINT NOT NULL,
    CONSTRAINT DiagXTrata_pk PRIMARY KEY (Id)
);

-- Table: Diagnosticos
CREATE TABLE Diagnosticos (
    idDiagnostico BIGINT NOT NULL AUTO_INCREMENT,
    Diagnostico varchar(200) NOT NULL,
    Citas_Medicas_idConsulta BIGINT NOT NULL,
    CONSTRAINT Diagnosticos_pk PRIMARY KEY (idDiagnostico)
);

-- Table: Entidad
CREATE TABLE Entidad (
    idEntidad BIGINT NOT NULL,
    nombreEntidad varchar(200) NOT NULL,
    token varchar(200) NOT NULL,
    CONSTRAINT Entidad_pk PRIMARY KEY (idEntidad)
);

-- Table: ExamenSegmentario
CREATE TABLE ExamenSegmentario (
    idExamen BIGINT NOT NULL AUTO_INCREMENT,
    cabeza varchar(200) NOT NULL,
    cuello varchar(200) NOT NULL,
    torax varchar(200) NOT NULL,
    AparatoCirculatorio varchar(200) NOT NULL,
    AparatoRespiratorio varchar(200) NOT NULL,
    Abdomen varchar(200) NOT NULL,
    AparatoUrogenital varchar(200) NOT NULL,
    SistemaNervioso varchar(200) NOT NULL,
    psicologicoMental varchar(200) NOT NULL,
    perine varchar(200) NOT NULL,
    examenGenital varchar(200) NOT NULL,
    miembrosSuperiores varchar(200) NOT NULL,
    miembrosInferiores varchar(200) NOT NULL,
    CONSTRAINT ExamenSegmentario_pk PRIMARY KEY (idExamen)
);

-- Table: Examen_Fisico
CREATE TABLE Examen_Fisico (
    idExamen BIGINT NOT NULL AUTO_INCREMENT,
    estadoConciencia varchar(200) NOT NULL,
    lenguaje varchar(200) NOT NULL,
    auditivo varchar(200) NOT NULL,
    agudezaVisual varchar(200) NOT NULL,
    peso float(10) NOT NULL,
    estatura float(10) NOT NULL,
    facie varchar(200) NOT NULL,
    edadRealAparente varchar(200) NOT NULL,
    temperatura float(10) NOT NULL,
    actitud varchar(200) NOT NULL,
    CONSTRAINT Examen_Fisico_pk PRIMARY KEY (idExamen)
);

-- Table: Examenes
CREATE TABLE Examenes (
    idExamen BIGINT NOT NULL AUTO_INCREMENT,
    resumen varchar(200) NOT NULL,
    resultados varchar(200) NOT NULL,
    anexos varchar(200) NOT NULL,
    TipoExamen_idTipoExamen BIGINT NOT NULL,
    Diagnosticos_idDiagnostico BIGINT NOT NULL,
    CONSTRAINT Examenes_pk PRIMARY KEY (idExamen)
);

-- Table: Fisiologica
CREATE TABLE Fisiologica (
    IdFisiologica BIGINT NOT NULL,
    lactancia varchar(200) NOT NULL,
    iniciacionSexual varchar(200) NOT NULL,
    ginecoObstretico varchar(200) NOT NULL,
    menarca varchar(200) NOT NULL,
    embarazos varchar(200) NOT NULL,
    partos varchar(200) NOT NULL,
    abortos varchar(200) NOT NULL,
    CONSTRAINT Fisiologica_pk PRIMARY KEY (IdFisiologica)
);

-- Table: Habitos
CREATE TABLE Habitos (
    idHabito BIGINT NOT NULL AUTO_INCREMENT,
    alimentacion varchar(200) NOT NULL,
    apetito varchar(200) NOT NULL,
    sed varchar(200) NOT NULL,
    diuresis varchar(200) NOT NULL,
    catarsisBIGINTestinal varchar(200) NOT NULL,
    sueno varchar(200) NOT NULL,
    relacionesSexuales varchar(200) NOT NULL,
    alcohol varchar(200) NOT NULL,
    tabaco varchar(200) NOT NULL,
    drogas varchar(200) NOT NULL,
    medicacion varchar(200) NOT NULL,
    CONSTRAINT Habitos_pk PRIMARY KEY (idHabito)
);

-- Table: Historia_Clinica
CREATE TABLE Historia_Clinica (
    idHistoria BIGINT NOT NULL AUTO_INCREMENT,
    Entidad_idEntidad BIGINT NOT NULL,
    Antecedentes_idAntecedente BIGINT NOT NULL,
    Fisiologica_IdFisiologica BIGINT NOT NULL,
    DNI_PACIENTE BIGINT DEFAULT NULL,
    CONSTRAINT Historia_Clinica_pk PRIMARY KEY (idHistoria)
);

-- Table: MedXTrata
CREATE TABLE MedXTrata (
    id BIGINT NOT NULL AUTO_INCREMENT,
    Medicamentos_idMedicamento BIGINT NOT NULL,
    Tratamientos_idTratamiento BIGINT NOT NULL,
    RepeticionMed varchar(200) NOT NULL,
    CONSTRAINT MedXTrata_pk PRIMARY KEY (id)
);

-- Table: Medicamentos
CREATE TABLE Medicamentos (
    idMedicamento BIGINT NOT NULL AUTO_INCREMENT,
    nombreMedicamento varchar(200) NOT NULL,
    gramaje float(10) NOT NULL,
    CONSTRAINT Medicamentos_pk PRIMARY KEY (idMedicamento)
);

-- Table: Medicos
CREATE TABLE Medicos (
    DNI BIGINT NOT NULL,
    nombreMedico varchar(200) NOT NULL,
    fechaNacimiento date NOT NULL,
    telefono BIGINT NOT NULL,
    CONSTRAINT Medicos_pk PRIMARY KEY (DNI)
);

-- Table: Pacientes
CREATE TABLE Pacientes (
    DNI BIGINT,
    nombreCliente varchar(200) NOT NULL,
    fechaNacimiento date NOT NULL,
    estadoCivil varchar(200) NOT NULL,
    telefono BIGINT NOT NULL,
    sexo varchar(200) NOT NULL,
    token varchar(200) NOT NULL,
    CONSTRAINT Pacientes_pk PRIMARY KEY (DNI)
);

-- Table: TipoExamen
CREATE TABLE TipoExamen (
    idTipoExamen BIGINT NOT NULL AUTO_INCREMENT,
    nombreTipo varchar(200) NOT NULL,
    CONSTRAINT TipoExamen_pk PRIMARY KEY (idTipoExamen)
);

-- Table: Tratamientos
CREATE TABLE Tratamientos (
    idTratamiento BIGINT NOT NULL AUTO_INCREMENT,
    concepto varchar(200) NOT NULL,
    CONSTRAINT Tratamientos_pk PRIMARY KEY (idTratamiento)
);

-- foreign keys
ALTER TABLE AcudientesXPacientes ADD CONSTRAINT FK_idPaciente FOREIGN KEY FK_idPaciente(DNIPACIENTE)
	REFERENCES Pacientes(DNI);
    
ALTER TABLE AcudientesXPacientes ADD CONSTRAINT FK_idAcudiente FOREIGN KEY FK_idAcudiente(DNIACUDIENTE)
	REFERENCES Acudientes(DNI);
    
-- Reference: CitasMedicasExamenSegmentario (table: Citas_Medicas)
ALTER TABLE Citas_Medicas ADD CONSTRAINT CitasMedicasExamenSegmentario FOREIGN KEY CitasMedicasExamenSegmentario (ExSegmentario_idExamen)
    REFERENCES ExamenSegmentario (idExamen);

-- Reference: Citas_Medicas_Examen_Fisico (table: Citas_Medicas)
ALTER TABLE Citas_Medicas ADD CONSTRAINT Citas_Medicas_Examen_Fisico FOREIGN KEY Citas_Medicas_Examen_Fisico (Examen_Fisico_idExamen)
    REFERENCES Examen_Fisico (idExamen);

-- Reference: Citas_Medicas_Habitos (table: Citas_Medicas)
ALTER TABLE Citas_Medicas ADD CONSTRAINT Citas_Medicas_Habitos FOREIGN KEY Citas_Medicas_Habitos (Habitos_idHabito)
    REFERENCES Habitos (idHabito);

-- Reference: Citas_Medicas_Historia_Clinica (table: Citas_Medicas)
ALTER TABLE Citas_Medicas ADD CONSTRAINT Citas_Medicas_Historia_Clinica FOREIGN KEY Citas_Medicas_Historia_Clinica (Historia_Clinica_idHistoria)
    REFERENCES Historia_Clinica (idHistoria);

-- Reference: Citas_Medicas_Medicos (table: Citas_Medicas)
ALTER TABLE Citas_Medicas ADD CONSTRAINT Citas_Medicas_Medicos FOREIGN KEY Citas_Medicas_Medicos (Medicos_idMedico)
    REFERENCES Medicos (DNI);

-- Reference: DiagXTrata_Diagnosticos (table: DiagXTrata)
ALTER TABLE DiagXTrata ADD CONSTRAINT DiagXTrata_Diagnosticos FOREIGN KEY DiagXTrata_Diagnosticos (Diagnosticos_idDiagnostico)
    REFERENCES Diagnosticos (idDiagnostico);

-- Reference: DiagXTrata_Tratamientos (table: DiagXTrata)
ALTER TABLE DiagXTrata ADD CONSTRAINT DiagXTrata_Tratamientos FOREIGN KEY DiagXTrata_Tratamientos (Tratamientos_idTratamiento)
    REFERENCES Tratamientos (idTratamiento);

-- Reference: Diagnosticos_Citas_Medicas (table: Diagnosticos)
ALTER TABLE Diagnosticos ADD CONSTRAINT Diagnosticos_Citas_Medicas FOREIGN KEY Diagnosticos_Citas_Medicas (Citas_Medicas_idConsulta)
    REFERENCES Citas_Medicas (idConsulta);

-- Reference: Examenes_Diagnosticos (table: Examenes)
ALTER TABLE Examenes ADD CONSTRAINT Examenes_Diagnosticos FOREIGN KEY Examenes_Diagnosticos (Diagnosticos_idDiagnostico)
    REFERENCES Diagnosticos (idDiagnostico);

-- Reference: Examenes_TipoExamen (table: Examenes)
ALTER TABLE Examenes ADD CONSTRAINT Examenes_TipoExamen FOREIGN KEY Examenes_TipoExamen (TipoExamen_idTipoExamen)
    REFERENCES TipoExamen (idTipoExamen);

-- Reference: Historia_Clinica_Antecedentes (table: Historia_Clinica)
ALTER TABLE Historia_Clinica ADD CONSTRAINT Historia_Clinica_Antecedentes FOREIGN KEY Historia_Clinica_Antecedentes (Antecedentes_idAntecedente)
    REFERENCES Antecedentes (idAntecedente);

-- Reference: Historia_Clinica_Entidad (table: Historia_Clinica)
ALTER TABLE Historia_Clinica ADD CONSTRAINT Historia_Clinica_Entidad FOREIGN KEY Historia_Clinica_Entidad (Entidad_idEntidad)
    REFERENCES Entidad (idEntidad);

-- Reference: Historia_Clinica_Fisiologica (table: Historia_Clinica)
ALTER TABLE Historia_Clinica ADD CONSTRAINT Historia_Clinica_Fisiologica FOREIGN KEY Historia_Clinica_Fisiologica (Fisiologica_IdFisiologica)
    REFERENCES Fisiologica (IdFisiologica);

-- Reference: Historia_Clinica_Pacientes (table: Historia_Clinica)
ALTER TABLE Historia_Clinica ADD CONSTRAINT Historia_Clinica_Pacientes FOREIGN KEY Historia_Clinica_Pacientes (DNI_PACIENTE)
    REFERENCES Pacientes (DNI);

-- Reference: MedXDiagXTrata_Medicamentos (table: MedXTrata)
ALTER TABLE MedXTrata ADD CONSTRAINT MedXDiagXTrata_Medicamentos FOREIGN KEY MedXDiagXTrata_Medicamentos (Medicamentos_idMedicamento)
    REFERENCES Medicamentos (idMedicamento);

-- Reference: MedXTrataXDiag_Tratamientos (table: MedXTrata)
ALTER TABLE MedXTrata ADD CONSTRAINT MedXTrataXDiag_Tratamientos FOREIGN KEY MedXTrataXDiag_Tratamientos (Tratamientos_idTratamiento)
    REFERENCES Tratamientos (idTratamiento);
    
-- unique keys
-- Reference (Unique key in Historias clinicas)
ALTER TABLE Historia_Clinica ADD CONSTRAINT U_Pacientes_idPaciente UNIQUE (DNI_PACIENTE);

ALTER TABLE Historia_Clinica ADD CONSTRAINT U_Fisiologicas_idFisiologica UNIQUE(Fisiologica_idFisiologica);

ALTER TABLE Historia_Clinica ADD CONSTRAINT U_Antecedentes_idAntecedente UNIQUE(Antecedentes_idAntecedente);

-- References (Unique key in Citas medicas)
ALTER TABLE Citas_Medicas ADD CONSTRAINT U_Examen_Fisico_idExamen UNIQUE(Examen_Fisico_idExamen);

ALTER TABLE Citas_Medicas ADD CONSTRAINT U_Habitos_idHabito UNIQUE(Habitos_idHabito);

ALTER TABLE Citas_Medicas ADD CONSTRAINT U_ExSegmentario_idExamen UNIQUE (ExSegmentario_idExamen);

-- References (Unique Key in Pacientes)
ALTER TABLE Pacientes ADD CONSTRAINT U_DNI_P UNIQUE (DNI);

-- References (Unique Key in Acudientes)
ALTER TABLE Acudientes ADD CONSTRAINT U_DNI_A UNIQUE (DNI);

-- Index
-- References AcudientesXPacientes
CREATE INDEX ix_idPaciente ON AcudientesXPacientes (DNIPACIENTE);
CREATE INDEX ix_idAcudiente ON AcudientesXPacientes (DNIACUDIENTE);

-- References Historia CLinica
CREATE INDEX ix_Entidad_idEntidad ON Historia_Clinica (Entidad_idEntidad);
CREATE INDEX ix_Antecedentes_idAntecedente ON Historia_Clinica (Antecedentes_idAntecedente);
CREATE INDEX ix_Fisiologica_idFisiologica ON Historia_Clinica (Fisiologica_idFisiologica);
CREATE INDEX ix_Pacientes_idPaciente ON Historia_Clinica (DNI_PACIENTE);

-- References Citas medicas
CREATE INDEX ix_Medicos_idMedico ON Citas_Medicas (Medicos_idMedico);
CREATE INDEX ix_Examen_Fisico_idExamen ON Citas_Medicas (Examen_Fisico_idExamen);
CREATE INDEX ix_Habitos_idHabito ON Citas_Medicas (Habitos_idHabito);
CREATE INDEX ix_ExSegmentario_idExamen ON Citas_Medicas (ExSegmentario_idExamen);
CREATE INDEX  ix_Historia_Clinica_idHistoria ON Citas_Medicas (Historia_Clinica_idHistoria);

-- References Examenes 
CREATE INDEX ix_TipoExamen_idTipoExamen ON Examenes (TipoExamen_idTipoExamen);
CREATE INDEX ix_Diagnosticos_idDiagnostico ON Examenes (Diagnosticos_idDiagnostico);

-- References Diagnosticos
CREATE INDEX ix_Citas_Medicas_idConsulta ON Diagnosticos (Citas_Medicas_idConsulta);

-- References DiagXTrata
CREATE INDEX ix_Diagnosticos_idDiagnostico ON DiagXTrata (Diagnosticos_idDiagnostico);
CREATE INDEX ix_Tratamientos_idTratamiento ON DiagXTrata (Tratamientos_idTratamiento);

-- References MedXTrata
CREATE INDEX ix_Medicamentos_idMedicamento ON MedXTrata (Medicamentos_idMedicamento);
CREATE INDEX ix_Tratamientos_idTratamiento ON MedXTrata (Tratamientos_idTratamiento);
 
-- End of file.

