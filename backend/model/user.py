from pydantic import BaseModel, Field
from typing import Any, Dict, List, Optional


class User(BaseModel):
    Nombre: str = Field(alias="Nombre")
    Apellidos: str = Field(alias="Apellidos")
    Telefono: Optional[str] = Field("", alias="Telefono")
    Email: Optional[str] = Field("", alias="Email")
    Fecha_de_creacion: Optional[str] = Field("", alias="Fecha de creacion")
    Numero_de_cliente: Optional[str] = Field("", alias="Numero de cliente")
    Ultima_cita: Optional[str] = Field("", alias="Ultima cita")
    Dni: Optional[str] = Field("", alias="Dni")
    Fecha_de_nacimiento: Optional[str] = Field("", alias="Fecha de nacimiento")
    Etiquetas: Optional[str] = Field("", alias="Etiquetas")
    Documentos: int = Field(alias="Documentos")
    Genero: Optional[str] = Field("", alias="Genero")
    Direccion: Optional[str] = Field("", alias="Direccion")
    Municipio: Optional[str] = Field("", alias="Municipio")
    Codigo_postal: Optional[str] = Field("", alias="Codigo postal")
    Iban: Optional[str] = Field("", alias="Iban")
    Bic: Optional[str] = Field("", alias="Bic")
    Pais: Optional[str] = Field("", alias="Pais")
    Prefix_1_edicion: Optional[str] = Field("", alias="Prefix 1 edicion")
    Otros_informes: Optional[str] = Field("", alias="Otros informes")
    Ano_diagnostico: Optional[str] = Field("", alias="Ano diagnostico")
    Aceleracion_curso: Optional[str] = Field("", alias="Aceleracion curso")
    Centro_diagnostico: Optional[str] = Field("", alias="Centro diagnostico")
    Tipo_de_colegio: Optional[str] = Field("", alias="Tipo de colegio")
    Diagnostico_previo_aacc: Optional[str] = Field("", alias="Diagnostico previo aacc")
    Colegio: Optional[str] = Field("", alias="Colegio")
    Medicacion: Optional[str] = Field("", alias="Medicacion")
    Reconocido_cmadrid: Optional[str] = Field("", alias="Reconocido cmadrid")
    En_terapia: Optional[str] = Field("", alias="En terapia")
    Profile_url: Optional[str] = Field("", alias="Profile_url")
    Files: Optional[List[str]] = Field([], alias="files")
    extra_data: Optional[Dict[str, Any]] = Field({}, alias="extra_data")

    model_config = {
        "populate_by_name": True,   # allows using Python field names in input
        "alias_priority": "alias",  # always prefer JSON alias when serializing
    }
