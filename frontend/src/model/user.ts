/**
 * User model matching the backend Python User model
 * Provides parse and serialize functions to convert between JSON format and TypeScript model
 */

// JSON format interface (matches the backend serialization format)
export interface UserJSON {
  Nombre: string;
  Apellidos: string;
  Telefono?: string;
  Email?: string;
  "Fecha de creacion"?: string;
  "Numero de cliente"?: string;
  "Ultima cita"?: string;
  Dni?: string;
  "Fecha de nacimiento"?: string;
  Etiquetas?: string;
  Documentos: number;
  Genero?: string;
  Direccion?: string;
  Municipio?: string;
  "Codigo postal"?: string;
  Iban?: string;
  Bic?: string;
  Pais?: string;
  "Prefix 1 edicion"?: string;
  "Otros informes"?: string;
  "Ano diagnostico"?: string;
  "Aceleracion curso"?: string;
  "Centro diagnostico"?: string;
  "Tipo de colegio"?: string;
  "Diagnostico previo aacc"?: string;
  Colegio?: string;
  Medicacion?: string;
  "Reconocido cmadrid"?: string;
  "En terapia"?: string;
  Profile_url?: string;
  files?: string[];
  extra_data?: Record<string, any>;
}

// TypeScript model class (internal representation)
export class User {
  Nombre: string;
  Apellidos: string;
  Telefono: string;
  Email: string;
  Fecha_de_creacion: string;
  Numero_de_cliente: string;
  Ultima_cita: string;
  Dni: string;
  Fecha_de_nacimiento: string;
  Etiquetas: string;
  Documentos: number;
  Genero: string;
  Direccion: string;
  Municipio: string;
  Codigo_postal: string;
  Iban: string;
  Bic: string;
  Pais: string;
  Prefix_1_edicion: string;
  Otros_informes: string;
  Ano_diagnostico: string;
  Aceleracion_curso: string;
  Centro_diagnostico: string;
  Tipo_de_colegio: string;
  Diagnostico_previo_aacc: string;
  Colegio: string;
  Medicacion: string;
  Reconocido_cmadrid: string;
  En_terapia: string;
  Profile_url: string;
  Files: string[];
  extra_data: Record<string, any>;

  constructor(data: Partial<User> = {}) {
    this.Nombre = data.Nombre || "";
    this.Apellidos = data.Apellidos || "";
    this.Telefono = data.Telefono || "";
    this.Email = data.Email || "";
    this.Fecha_de_creacion = data.Fecha_de_creacion || "";
    this.Numero_de_cliente = data.Numero_de_cliente || "";
    this.Ultima_cita = data.Ultima_cita || "";
    this.Dni = data.Dni || "";
    this.Fecha_de_nacimiento = data.Fecha_de_nacimiento || "";
    this.Etiquetas = data.Etiquetas || "";
    this.Documentos = data.Documentos ?? 0;
    this.Genero = data.Genero || "";
    this.Direccion = data.Direccion || "";
    this.Municipio = data.Municipio || "";
    this.Codigo_postal = data.Codigo_postal || "";
    this.Iban = data.Iban || "";
    this.Bic = data.Bic || "";
    this.Pais = data.Pais || "";
    this.Prefix_1_edicion = data.Prefix_1_edicion || "";
    this.Otros_informes = data.Otros_informes || "";
    this.Ano_diagnostico = data.Ano_diagnostico || "";
    this.Aceleracion_curso = data.Aceleracion_curso || "";
    this.Centro_diagnostico = data.Centro_diagnostico || "";
    this.Tipo_de_colegio = data.Tipo_de_colegio || "";
    this.Diagnostico_previo_aacc = data.Diagnostico_previo_aacc || "";
    this.Colegio = data.Colegio || "";
    this.Medicacion = data.Medicacion || "";
    this.Reconocido_cmadrid = data.Reconocido_cmadrid || "";
    this.En_terapia = data.En_terapia || "";
    this.Profile_url = data.Profile_url || "";
    this.Files = data.Files || [];
    this.extra_data = data.extra_data || {};
  }

  /**
   * Parse JSON format to User model
   * @param json - JSON object matching UserJSON interface
   * @returns User instance
   */
  static parse(json: UserJSON): User {
    return new User({
      Nombre: json.Nombre,
      Apellidos: json.Apellidos,
      Telefono: json.Telefono || "",
      Email: json.Email || "",
      Fecha_de_creacion: json["Fecha de creacion"] || "",
      Numero_de_cliente: json["Numero de cliente"] || "",
      Ultima_cita: json["Ultima cita"] || "",
      Dni: json.Dni || "",
      Fecha_de_nacimiento: json["Fecha de nacimiento"] || "",
      Etiquetas: json.Etiquetas || "",
      Documentos: json.Documentos,
      Genero: json.Genero || "",
      Direccion: json.Direccion || "",
      Municipio: json.Municipio || "",
      Codigo_postal: json["Codigo postal"] || "",
      Iban: json.Iban || "",
      Bic: json.Bic || "",
      Pais: json.Pais || "",
      Prefix_1_edicion: json["Prefix 1 edicion"] || "",
      Otros_informes: json["Otros informes"] || "",
      Ano_diagnostico: json["Ano diagnostico"] || "",
      Aceleracion_curso: json["Aceleracion curso"] || "",
      Centro_diagnostico: json["Centro diagnostico"] || "",
      Tipo_de_colegio: json["Tipo de colegio"] || "",
      Diagnostico_previo_aacc: json["Diagnostico previo aacc"] || "",
      Colegio: json.Colegio || "",
      Medicacion: json.Medicacion || "",
      Reconocido_cmadrid: json["Reconocido cmadrid"] || "",
      En_terapia: json["En terapia"] || "",
      Profile_url: json.Profile_url || "",
      Files: json.files || [],
      extra_data: json.extra_data || {},
    });
  }

  /**
   * Serialize User model to JSON format
   * @returns JSON object matching UserJSON interface
   */
  serialize(): UserJSON {
    return {
      Nombre: this.Nombre,
      Apellidos: this.Apellidos,
      Telefono: this.Telefono,
      Email: this.Email,
      "Fecha de creacion": this.Fecha_de_creacion,
      "Numero de cliente": this.Numero_de_cliente,
      "Ultima cita": this.Ultima_cita,
      Dni: this.Dni,
      "Fecha de nacimiento": this.Fecha_de_nacimiento,
      Etiquetas: this.Etiquetas,
      Documentos: this.Documentos,
      Genero: this.Genero,
      Direccion: this.Direccion,
      Municipio: this.Municipio,
      "Codigo postal": this.Codigo_postal,
      Iban: this.Iban,
      Bic: this.Bic,
      Pais: this.Pais,
      "Prefix 1 edicion": this.Prefix_1_edicion,
      "Otros informes": this.Otros_informes,
      "Ano diagnostico": this.Ano_diagnostico,
      "Aceleracion curso": this.Aceleracion_curso,
      "Centro diagnostico": this.Centro_diagnostico,
      "Tipo de colegio": this.Tipo_de_colegio,
      "Diagnostico previo aacc": this.Diagnostico_previo_aacc,
      Colegio: this.Colegio,
      Medicacion: this.Medicacion,
      "Reconocido cmadrid": this.Reconocido_cmadrid,
      "En terapia": this.En_terapia,
      Profile_url: this.Profile_url,
      files: this.Files,
      extra_data: this.extra_data,
    };
  }

  /**
   * Create User from JSON string
   * @param jsonString - JSON string
   * @returns User instance
   */
  static fromJSON(jsonString: string): User {
    const json = JSON.parse(jsonString) as UserJSON;
    return User.parse(json);
  }

  /**
   * Convert User to JSON string
   * @returns JSON string
   */
  toJSON(): string {
    return JSON.stringify(this.serialize());
  }
}

