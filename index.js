var express = require('express')
var path = require('path')
var pug = require('ejs')
var app = express()

app.set('port', (process.env.PORT || 5000))

app.use(express.static(path.join(__dirname, 'vendor/Admin')))
app.set('view engine', 'ejs');
app.set('views', './vendor/Admin')

app.get("/admin", (req, res) => {
   res.render('main', {header: 'dashboard_test'})
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})


