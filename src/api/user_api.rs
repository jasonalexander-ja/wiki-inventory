use crate::{
    models::user_model::User, 
    repository::mongodb_repo::MongoRepo,
    forms::pagination::PaginationForm,
    forms::results::Results,
    forms::user::UserProps,
    business_logic::users_logic
};

use mongodb::{
    bson::oid::ObjectId, 
    results::InsertOneResult
};

use rocket::{
    http::Status, 
    serde::json::Json, 
    State
};


#[post("/user", data = "<new_user>")]
pub fn create_user(
    db: &State<MongoRepo>,
    new_user: Json<User>,
) -> Result<Json<InsertOneResult>, Status> {
    let data = User {
        id: None,
        name: new_user.name.to_owned(),
        location: new_user.location.to_owned(),
        title: new_user.title.to_owned(),
    };
    let user_detail = db.create_user(data);
    match user_detail {
        Ok(user) => Ok(Json(user)),
        Err(_) => Err(Status::InternalServerError),
    }
}

#[get("/user/<path>")]
pub fn get_user(db: &State<MongoRepo>, path: String) -> Result<Json<User>, Status> {
    let id = path;
    if id.is_empty() {
        return Err(Status::BadRequest);
    };
    let user_detail = db.get_user(&id);
    match user_detail {
        Ok(user) => Ok(Json(user)),
        Err(_) => Err(Status::InternalServerError),
    }
}

#[put("/user/<path>", data = "<new_user>")]
pub fn update_user(
    db: &State<MongoRepo>,
    path: String,
    new_user: Json<User>,
) -> Result<Json<User>, Status> {
    let id = path;
    if id.is_empty() {
        return Err(Status::BadRequest);
    };
    let data = User {
        id: Some(ObjectId::parse_str(&id).unwrap()),
        name: new_user.name.to_owned(),
        location: new_user.location.to_owned(),
        title: new_user.title.to_owned(),
    };
    let update_result = db.update_user(&id, data);
    match update_result {
        Ok(update) => {
            if update.matched_count == 1 {
                let updated_user_info = db.get_user(&id);
                return match updated_user_info {
                    Ok(user) => Ok(Json(user)),
                    Err(_) => Err(Status::InternalServerError),
                };
            } else {
                return Err(Status::NotFound);
            }
        }
        Err(_) => Err(Status::InternalServerError),
    }
}

#[delete("/user/<path>")]
pub fn delete_user(db: &State<MongoRepo>, path: String) -> Result<Json<&str>, Status> {
    let id = path;
    if id.is_empty() {
        return Err(Status::BadRequest);
    };
    let result = db.delete_user(&id);
    match result {
        Ok(res) => {
            if res.deleted_count == 1 {
                return Ok(Json("User successfully deleted!"));
            } else {
                return Err(Status::NotFound);
            }
        }
        Err(_) => Err(Status::InternalServerError),
    }
}

#[get("/users?<query_params>&<pagination..>")]
pub fn get_all_users(
    db: &State<MongoRepo>,
    query_params: Option<String>,
    pagination: Option<PaginationForm>
) -> Result<Json<Results<User>>, Status> {
    let (search, sort) = match UserProps::decode_from_opt_str(&query_params) {
        Ok(v) => v,
        Err(e) => return e.to_rocket()
    };

    match users_logic::get_users(
        db, pagination, search, sort
    ) {
        Ok((vals, no)) => Results::new_result_json(vals, no),
        Err(err) => err.to_rocket()
    }
}
