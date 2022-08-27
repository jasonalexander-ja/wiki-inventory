use mongodb::bson::{
    document::Document,
    to_document,
    doc
};
use serde::{Serialize, Deserialize};
use rocket::FromForm;

use crate::{
    utils::error::Error,
    utils::bson::clear_nulls,
    forms::IntoDocument
};

use base64;
use serde_json;


#[derive(Debug, Serialize, Deserialize)]
pub struct UserProps {
    pub search_params: Option<UserSearch>,
    pub sort_params: Option<UserSort>
}

impl UserProps {
    pub fn decode_from_opt_str(
        str: &Option<String>
    ) -> Result<(Option<UserSearch>, Option<UserSort>), Error> {
        match str {
            Some(val) => Self::decode_from_str(val),
            None => Ok((None, None))
        }
    }

    pub fn decode_from_str(
        str: &String
    ) -> Result<(Option<UserSearch>, Option<UserSort>), Error> {

        let json_vec  = match base64::decode(str) {
            Ok(dec) => dec,
            Err(_) => return Err(Error::InternalError)
        };

        let json_string = String::from_utf8_lossy(&json_vec);

        match serde_json::from_str::<UserProps>(&*json_string) {
            Ok(v) => Ok((v.search_params, v.sort_params)),
            Err(_) => Ok((None, None))
        }
    }
}

#[derive(Debug, Serialize, Deserialize, FromForm, Clone)]
pub struct UserSearch {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,
    pub name: Option<String>,
    pub location: Option<String>,
    pub title: Option<String>,
}

impl IntoDocument for UserSearch {
    fn to_bson(&self) -> Result<Document, Error> {
        match to_document(self) {
            Ok(d) => Ok(clear_nulls(&d)),
            Err(_) => Err(Error::InternalError)
        }
    }
}

#[derive(Debug, Serialize, Deserialize, FromForm, Clone)]
pub struct UserSort {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<i32>,
    pub name: Option<i32>,
    pub location: Option<i32>,
    pub title: Option<i32>,
}

impl UserSort { 
    fn normalise(&self) -> UserSort {
        UserSort { 
            id: to_bit(self.id), 
            name: to_bit(self.name), 
            location: to_bit(self.location), 
            title: to_bit(self.title) 
        }
    }
}

fn to_bit(d: Option<i32>) -> Option<i32> {
    match d {
        Some(v) => if v > 0 { Some(1) }
            else { Some(-1) },
        _ => None
    }
}

impl IntoDocument for UserSort {
    fn to_bson(&self) -> Result<Document, Error> {
        let new_sort = self.normalise();
        match to_document(&new_sort) {
            Ok(doc) => Ok(clear_nulls(&doc)),
            Err(_) => Err(Error::InternalError)
        }
    }
}
