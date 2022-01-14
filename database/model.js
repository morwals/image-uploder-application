var Schema = new mongoose.Schema({
    name: String,
    img:
    {
        data: Buffer,
        contentType: String
    }
});