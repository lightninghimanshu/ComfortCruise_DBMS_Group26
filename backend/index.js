var mysql = require('mysql2')
var express = require('express')
var bodyParser = require('body-parser')
const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'dbms',
})
var jsonParser = bodyParser.json()
const app = express()
app.get('/users', function (req, res) {
  connection.getConnection(function (err, connection) {
    connection.query('SELECT * FROM driver', function (error, results, fields) {
      if (error) throw error
      res.send(results)
    })
  })
})

app.get('/NearbyBookings', jsonParser, function (req, res) {
  // console.log(req.query)
  let sql = `Select Driver_Id,v4.s SourceName,v4.cl CurrentLocation, v4.Ride_id,v4.date,
    sqrt(power((a.X_Coordinate-b.X_Coordinate),2)+power((a.Y_Coordinate-b.Y_Coordinate),2)) as Distance from v4
    Join location a on a.Location_Name=v4.s
    Join location b on b.Location_Name=v4.cl
    where Driver_Id=94 and v4.date not in
    (Select ride.Date from ride where Driver_id=94 and Status='Booked')
    order by Distance;`
  connection.getConnection(function (err, connection) {
    connection.query(sql, function (error, results, fields) {
      if (error) {
        console.log(error)
        res.send(error)
      }
      // console.log(results)
      res.send(results)
    })
  })
})

app.post('/DriverInfo', jsonParser, function (req, res) {
  let sql = `Select * from driver where Driver_Id=${req.body.Driver_Id}`
  console.log(sql)
  connection.getConnection(function (err, connection) {
    connection.query(sql, function (error, results, fields) {
      if (error) {
        console.log(error)
        res.send(error)
      }
      console.log(results)
      res.send(results)
    })
  })
})

app.post('/CustomerSignUp', jsonParser, function (req, res) {
  console.log(req.body)
  let sql =
    "INSERT INTO customer (Age, Name, Wallet, Phone_Number, Email_Address, Rating, No_of_Trips, Home_Location) VALUES ('" +
    req.body.Age +
    "', '" +
    req.body.Name +
    "', '" +
    req.body.Wallet +
    "', '" +
    req.body.Phone_Number +
    "', '" +
    req.body.Email_Address +
    "', '" +
    req.body.Rating +
    "', '" +
    req.body.No_of_Trips +
    "', '" +
    req.body.Home_Location +
    "')"
  connection.getConnection(function (err, connection) {
    // let sql = 'SELECT * FROM driver'
    connection.query(sql, function (error, results, fields) {
      if (error) {
        console.log(error)
        res.send(error)
      }
      res.send(results)
    })
  })
})

app.get('/AnalysisOLAP', jsonParser, function (req, res) {
  let sql = `SELECT SourceName,Vehicle_Type,
  Count(Case when Month(Date)=1 then Ride_Id end) as 'January',
  Count(Case when Month(Date)=2 then Ride_Id end) as 'February',
  Count(Case when Month(Date)=3 then Ride_Id end) as 'March',
  Count(Case when Month(Date)=4 then Ride_Id end) as 'April',
  Count(Case when Month(Date)=5 then Ride_Id end) as 'May',
  Count(Case when Month(Date)=6 then Ride_Id end) as 'June',
  Count(Case when Month(Date)=6 then Ride_Id end) as 'June',
  Count(Case when Month(Date)=7 then Ride_Id end) as 'July',
  Count(Case when Month(Date)=8 then Ride_Id end) as 'August',
  count(Case when Month(Date)=9 then Ride_Id end) as 'September',
  Count(Case when Month(Date)=10 then Ride_Id end) as 'October',
  count(Case when Month(Date)=11 then Ride_Id end) as 'November',
  Count(Case when Month(Date)=12 then Ride_Id end) as 'December'
  from ride group by SourceName,Vehicle_Type order by SourceName;`

  connection.getConnection(function (err, connection) {
    connection.query(sql, function (error, results, fields) {
      if (error) {
        console.log(error)
      }
      console.log(results)
      res.send(results)
    })
  })
})

app.get('/VehicleAndDriverRevenueOLAP', jsonParser, function (req, res) {
  let sql = `SELECT 
  Vehicle_Type, 
  Driver_Id, 
  SUM(Cost) AS TotalCost
FROM ride
where Status='COMPLETED'
Group By Vehicle_Type, Driver_Id With ROllUP;`

  connection.getConnection(function (err, connection) {
    connection.query(sql, function (error, results, fields) {
      if (error) {
        console.log(error)
      }
      res.send(results)
    })
  })
})

app.get('/YearlyRevenueOLAP', jsonParser, function (req, res) {
  let sql = `Select Year(Date) as Y,Month(Date) as M,Date,Sum(Cost) as C from ride
  where Status='COMPLETED'
  Group by Year(Date),Month(Date),Date with Rollup;
  `
  connection.getConnection(function (err, connection) {
    connection.query(sql, function (error, results, fields) {
      if (error) {
        console.log(error)
      }
      res.send(results)
    })
  })
})

app.get('/AgeWiseRevenueOLAP', jsonParser, function (req, res) {
  let sql = `SELECT floor(Age/10)*10 as Age_Group, COUNT(Customer_id) as customer_count, AVG(No_of_Trips) as avg_trips
  FROM customer
  WHERE Home_Location = 'Hauz Khas'
  GROUP BY floor(Age/10)*10;
  `
  connection.getConnection(function (err, connection) {
    connection.query(sql, function (error, results, fields) {
      if (error) {
        console.log(error)
      }
      res.send(results)
    })
  })
})

app.post('/RequestRide', jsonParser, function (req, res) {
  console.log(req.body)
  let sql =
    "Insert Into ride(Status,Customer_Id,Start_time,End_Time,Date,Payment_method,SourceName,DestinationName,Vehicle_Type) values('REQUESTED'," +
    req.body.Customer_Id +
    ",'" +
    req.body.Start_time +
    "','" +
    req.body.End_Time +
    "','" +
    req.body.Dates +
    "','" +
    req.body.Payment_method +
    "','" +
    req.body.SourceName +
    "','" +
    req.body.DestinationName +
    "','" +
    req.body.Vehicle_Type +
    "')"
  connection.getConnection(function (err, connection) {
    connection.query(sql, function (error, results, fields) {
      if (error) {
        console.log(error)
      }
      console.log(results)
      sql = `Select * from ride where Ride_Id=${results.insertId}`
      connection.query(sql, function (error, results, fields) {
        if (error) {
          console.log(error)
        }
        console.log(results)
        res.send(results)
      })
    })
  })
})

app.get('/CheckPropsedBooking', jsonParser, function (req, res) {
  console.log(req.body)
  let sql = "select * from proposed_booking where Ride_Id=5;"
  connection.getConnection(function (err, connection) {
    connection.query(sql, function (error, results, fields) {
      if (error) {
        console.log(error)
      }
      console.log(results)
      res.send(results)
    })
  })
})

app.post("/SetProposedBooking", jsonParser, function (req, res) {
  console.log(req.body)
  let sql = "update ride set Status='BOOKED' where Ride_Id=" + req.body.Ride_Id + ";"
  connection.getConnection(function (err, connection) {
      connection.query(sql, function (error, results, fields) {
          if (error) {
              console.log(error)
          }
          console.log(results)
          res.send(results)
      })
  })
})

// Starting our server.
app.listen(3000, () => {})
