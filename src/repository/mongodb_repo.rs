use std::env;
extern crate dotenv;
use dotenv::dotenv;

use mongodb::{
    bson::{
        extjson::de::Error, 
        oid::ObjectId, 
        document::Document,
        doc
    },
    results::{InsertOneResult, UpdateResult, DeleteResult},
    sync::{Client, Collection},
    options::FindOptions,
    error
};
use crate::{
    models::user_model::User,
    forms::pagination::PaginationForm,
    utils::error::error_to_opt
};
use super::utils;

pub struct MongoRepo {
    col: Collection<User>,
}

impl MongoRepo {
    pub fn init() -> Self {
        dotenv().ok();
        let uri = match env::var("MONGOURI") {
            Ok(v) => v.to_string(),
            Err(_) => format!("Error loading env variable"),
        };
        let client = Client::with_uri_str(uri).unwrap();
        let db = client.database("rustDB");
        let col: Collection<User> = db.collection("User");
        MongoRepo { col }
    }

    pub fn create_user(&self, new_user: User) -> Result<InsertOneResult, Error> {
        let new_doc = User {
            id: None,
            name: new_user.name,
            location: new_user.location,
            title: new_user.title,
        };
        let user = self
            .col
            .insert_one(new_doc, None)
            .ok()
            .expect("Error creating user");
        Ok(user)
    }

    pub fn update_user(
        &self, 
        id: &String, 
        new_user: User
    ) -> Result<UpdateResult, Error> {
        let obj_id = ObjectId::parse_str(id).unwrap();
        let filter = doc! {"_id": obj_id};
        let new_doc = doc! {
            "$set":
                {
                    "id": new_user.id,
                    "name": new_user.name,
                    "location": new_user.location,
                    "title": new_user.title
                },
        };
        let updated_doc = self
            .col
            .update_one(filter, new_doc, None)
            .ok()
            .expect("Error updating user");
        Ok(updated_doc)
    }

    pub fn get_user(&self, id: &String) -> Result<User, Error> {
        let obj_id = ObjectId::parse_str(id).unwrap();
        let filter = doc! {"_id": obj_id};
        let user_detail = self
            .col
            .find_one(filter, None)
            .ok()
            .expect("Error getting user's detail");
        Ok(user_detail.unwrap())
    }

    pub fn delete_user(&self, id: &String) -> Result<DeleteResult, Error> {
        let obj_id = ObjectId::parse_str(id).unwrap();
        let filter = doc! {"_id": obj_id};
        let user_detail = self
            .col
            .delete_one(filter, None)
            .ok()
            .expect("Error deleting user");
        Ok(user_detail)
    }

    pub fn get_all_users(
        &self,
        pagination: &Option<PaginationForm>,
        search_doc: &Option<Document>,
        sort: &Option<Document>
    ) -> Result<Vec<User>, error::Error> {
        let options = Self::make_find_options(pagination, sort);
        let search = utils::convert_opt_to_regex(search_doc);

        let cursors = self.col
            .find(search.clone(), options)?;
        
        let users: Vec<User> = cursors.filter_map(error_to_opt)
            .map(|doc| doc)
            .collect();
        
        Ok(users)
    }

    fn make_find_options(
        pagination: &Option<PaginationForm>, 
        sort: &Option<Document>
    ) -> FindOptions {
        let skip = match pagination {
            Some(p) => Some(p.rows as u64 * p.page),
            _ => None
        };
        let limmit = match pagination { 
            Some(p) => Some(p.rows),
            None => None
        };
        
        FindOptions::builder()
            .limit(limmit)
            .skip(skip)
            .sort(sort.clone())
            .build()
    }

    pub fn count_users(&self, search_doc: &Option<Document>) -> Result<u64, error::Error> {
        let search = utils::convert_opt_to_regex(search_doc);
        self.col.count_documents(search.clone(), None)
    }
}
