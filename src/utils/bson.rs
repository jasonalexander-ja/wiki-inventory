use mongodb::bson::Document;


pub fn clear_nulls(doc: &Document) -> Document {
    let iter = doc.iter();

    let mut new_doc = Document::new();

    for (key, value) in iter {
        if !doc.is_null(key) {
            new_doc.insert(key, value);
        }
    }

    new_doc
}

