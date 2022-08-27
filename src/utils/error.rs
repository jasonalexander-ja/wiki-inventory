use rocket::http::Status;


pub enum Error {
    //NotFound,
    InternalError
}

impl Error {
    pub fn to_rocket<T>(&self) -> Result<T, Status> {
        match self {
            //Error::NotFound => Err(Status::NotFound),
            _ => Err(Status::InternalServerError)
        }
    }
}

pub fn error_to_opt<T, E>(val: Result<T, E>) -> Option<T> {
    match val {
        Ok(v) => Some(v),
        Err(_) => None
    }
}
