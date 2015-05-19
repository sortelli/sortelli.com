---
layout: post
title:  Using Google OpenID Connect with nodejs/express
date:   2015-05-19 18:00:00
---

Using [Passport][passport] makes it pretty simple to allow your app
to authenticate with Google OpenID Connect.

First, install the necessary npm pacakges:

{% highlight bash %}
% npm install passport passport-google-openidconnect --save
{% endhighlight %}

Second, configure the openid connect passport strategy:

{% highlight coffeescript %}
passport.serializeUser   (user, done) -> done null, user
passport.deserializeUser ( obj, done) -> done null, obj

passport.use new (require('passport-google-openidconnect').Strategy)
    clientID:     config.google.client_id
    clientSecret: config.google.client_secret
    callbackURL:  config.google.callback_url
  , (iss, sub, profile, accessToken, refreshToken, done) ->
    done(null, profile)

app.use passport.initialize()
app.use passport.session()
{% endhighlight %}

Finally setup routes for authenticating:

{% highlight coffeescript %}
app.get '/auth/google', passport.authenticate(
  'google-openidconnect', scope: ['profile', 'email']
)

# This route should match the URL you put in callbackURL above
app.get '/auth/google/return',
  passport.authenticate('google-openidconnect', { failureRedirect: '/' }),
  (req, res) ->
    res.redirect '/'
{% endhighlight %}

Lets create a few routes to test that the auth worked and returned
the Google name and email address as expected.

{% highlight coffeescript %}
# Return JSON object with Google name and email address if logged
# in, or error 400 if not logged in
app.get '/api/session/user', (req, res) ->
  sess = req.session

  if sess.passport and sess.passport.user and sess.passport.user.displayName
    res.json
      name:  sess.passport.user.displayName
      email: sess.passport.user._json.email
  else
    res.status(400).send 'No active session'

# Destroys session
app.get '/api/session/logout', (req, res) ->
  req.session.destroy ->
    res.redirect '/'
{% endhighlight %}

You can get your ClientID and Secret by creating a free Developer
Google account and project using the [Google Developer
Console][google-dev]. See the [OpenID Connect][connect] documentation
for more information.

[passport]:   http://passportjs.org/
[google-dev]: https://console.developers.google.com
[connect]:    https://developers.google.com/accounts/cookbook/technologies/OpenID-Connect
