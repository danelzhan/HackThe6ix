export class Drug {
    constructor(name, ingredient, din, form, dosage, frequency, category, start_date, end_date, notes) {
        this.drug_name = name;
        this.drug_ingredient = ingredient;
        this.din = din;
        this.form = form;
        this.dosage = dosage;
        this.frequency = frequency;
        this.category = category;
        this.start_date = start_date;
        this.end_date = end_date;
        this.notes = notes;
    }
}

export class Patient {
    constructor({
        _id,
        name,
        age,
        sex,
        doctor,
        nodes = [],
        edges = [],
        medical_history = [],
        allergies = []
    }) {
        this._id = _id; // Auth0 email
        this.name = name;
        this.age = age;
        this.sex = sex;
        this.doctor = doctor;
        this.nodes = nodes;
        this.edges = edges;
        this.medical_history = medical_history;
        this.allergies = allergies;
    }
}