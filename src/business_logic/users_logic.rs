use crate::{
    repository::mongodb_repo::MongoRepo,
    models::user_model::User,
    forms::pagination::PaginationForm,
    forms::user::{UserSearch, UserSort},
    forms::utils::IntoDocument,
    utils::error::Error
};

use rocket::State;


pub fn get_users(
    db: &State<MongoRepo>,
    pagination: Option<PaginationForm>,
    search: Option<UserSearch>,
    sorting: Option<UserSort>
) -> Result<(Vec<User>, u64), Error> {
    let seatch_doc = match search {
        Some(val) => Some(val.to_bson()?),
        None => None
    };
    let sorting_doc = match sorting {
        Some(val) => Some(val.to_bson()?),
        None => None
    };

    let users = match db.get_all_users(
        &pagination, &seatch_doc, &sorting_doc
    ) {
        Ok(v) => v,
        Err(_) => return Err(Error::InternalError)
    };

    let count = match db.count_users(&seatch_doc) {
        Ok(v) => v,
        Err(_) => return Err(Error::InternalError)
    };
    
    Ok((users, count))
}
