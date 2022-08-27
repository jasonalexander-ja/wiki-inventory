use serde::{Serialize, Deserialize};
use rocket::serde::json::Json;


#[derive(Debug, Serialize, Deserialize)]
pub struct Results<T> {
    pub results: Vec<T>,
    pub count: u64
}

impl<T> Results<T> {
    pub fn new(results: Vec<T>, count: u64) -> Self {
        Results { results, count }
    }

    pub fn new_result_json<E>(results: Vec<T>, count: u64) -> Result<Json<Self>, E> {
        Ok(Json(Results::new(results, count)))
    }
}
