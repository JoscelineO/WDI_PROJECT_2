const mongoose  = require('mongoose');
const bcrypt    = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: { type: String, trim: true, required: true },
  passwordHash: { type: String, trim: true, required: true },
  username: { type: String, unique: true, required: true },
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  scrapbooks: [{ type: mongoose.Schema.ObjectId, ref: 'Scrapbook' }]
}, {
  timestamps: true
});

userSchema
  .virtual('password')
  .set(setPassword);

userSchema
  .virtual('passwordConfirmation')
  .set(setPasswordConfirmation);

userSchema
  .path('passwordHash')
  .validate(validatePasswordHash);

userSchema.methods.validatePassword = validatePassword;

userSchema.set('toJSON', {
  transform: function(doc, ret) {
    delete ret.passwordHash;
    delete ret.__v;
    return ret;
  }
});

function setPassword(value){
  this._password    = value;
  this.passwordHash = bcrypt.hashSync(value, bcrypt.genSaltSync(8));
}

function setPasswordConfirmation(passwordConfirmation) {
  this._passwordConfirmation = passwordConfirmation;
}

function validatePasswordHash() {
  if (this.isNew) {
    if (!this._password) {
      return this.invalidate('password', 'A password is required.');
    }

    if (this._password.length < 6) {
      return this.invalidate('password', 'Password must be longer than 6 characters');
    }

    if (this._password !== this._passwordConfirmation) {
      return this.invalidate('passwordConfirmation', 'Passwords do not match.');
    }
  }
}

function validatePassword(password){
  return bcrypt.compareSync(password, this.passwordHash);
}

module.exports = mongoose.model('User', userSchema);
