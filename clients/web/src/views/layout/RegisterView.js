import { getCurrentUser, setCurrentUser, getCurrentToken, setCurrentToken, corsAuth } from 'girder/auth';
import { handleClose, handleOpen } from 'girder/utilities/DialogHelper';
import { events } from 'girder/events';
import RegisterDialogTemplate from 'girder/templates/layout/registerDialog.jade';
import UserModel from 'girder/models/UserModel';
import View from 'girder/view';

import 'bootstrap/js/modal';
import 'girder/utilities/jQuery'; // $.girderModal

/**
 * This view shows a register modal dialog.
 */
var RegisterView = View.extend({
    events: {
        'submit #g-register-form': function (e) {
            e.preventDefault();

            this.$('.form-group').removeClass('has-error');

            if (this.$('#g-password').val() !== this.$('#g-password2').val()) {
                this.$('#g-group-password,#g-group-password2').addClass('has-error');
                this.$('#g-password').focus();
                this.$('.g-validation-failed-message').text('Passwords must match.');
                return;
            }

            var user = new UserModel({
                login: this.$('#g-login').val(),
                password: this.$('#g-password').val(),
                email: this.$('#g-email').val(),
                firstName: this.$('#g-firstName').val(),
                lastName: this.$('#g-lastName').val()
            });
            user.on('g:saved', function () {
                if (getCurrentUser()) {
                    this.trigger('g:userCreated', {
                        user: user
                    });
                } else {
                    var authToken = user.get('authToken') || {};

                    setCurrentUser(user);
                    setCurrentToken(authToken.token);

                    if (corsAuth) {
                        document.cookie = 'girderToken=' + getCurrentToken();
                    }

                    handleClose('register', {replace: true});
                    events.trigger('g:login');
                }

                this.$el.modal('hide');
            }, this).on('g:error', function (err) {
                var resp = err.responseJSON;
                this.$('.g-validation-failed-message').text(resp.message);
                if (resp.field) {
                    this.$('#g-group-' + resp.field).addClass('has-error');
                    this.$('#g-' + resp.field).focus();
                }
                this.$('#g-register-button').removeClass('disabled');
            }, this).save();

            this.$('#g-register-button').addClass('disabled');
            this.$('.g-validation-failed-message').text('');
        },

        'click a.g-login-link': function () {
            events.trigger('g:loginUi');
        }
    },

    render: function () {
        var view = this;
        this.$el.html(RegisterDialogTemplate({
            currentUser: getCurrentUser(),
            title: getCurrentUser() ? 'Create new user' : 'Sign up'
        })).girderModal(this)
            .on('shown.bs.modal', function () {
                view.$('#g-login').focus();
            }).on('hidden.bs.modal', function () {
                handleClose('register', {replace: true});
            });
        this.$('#g-login').focus();

        handleOpen('register', {replace: true});

        return this;
    }

});

export default RegisterView;
