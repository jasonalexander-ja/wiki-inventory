use mongodb::bson::document::Document;
use mongodb::bson::Regex;


pub fn convert_opt_to_regex(d: &Option<Document>) -> Option<Document> {
    match d {
        Some(d) => convert_to_regex(d),
        None => None
    }
}

pub fn convert_to_regex(d: &Document) -> Option<Document> {
    let mut new_doc = Document::new();

    for (key, _v) in d.iter() {
        let v = match d.get_str(key) {
            Ok(v) => v,
            Err(_) => return None
        };
        new_doc.insert(key, make_regex(v));
    }

    Some(new_doc)
}

fn make_regex(s: &str) -> Regex {
    Regex { pattern: s.to_owned(), options: "i".to_owned() }
}
