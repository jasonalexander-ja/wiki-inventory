use mongodb::bson::document::Document;

use crate::utils::error::Error;


pub trait IntoDocument {
    fn to_bson(&self) -> Result<Document, Error>;
}
