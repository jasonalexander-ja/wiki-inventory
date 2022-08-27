use rocket::FromForm;

#[derive(FromForm)]
pub struct PaginationForm {
    pub page: u64,
    pub rows: i64
}
