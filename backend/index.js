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
  CurrentRide
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
  Count(Case when Month(Date)=1 then Ride_id end) as 'January',
  Count(Case when Month(Date)=2 then Ride_id end) as 'February',
  Count(Case when Month(Date)=3 then Ride_id end) as 'March',
  Count(Case when Month(Date)=4 then Ride_id end) as 'April',
  Count(Case when Month(Date)=5 then Ride_id end) as 'May',
  Count(Case when Month(Date)=6 then Ride_id end) as 'June',
  Count(Case when Month(Date)=6 then Ride_id end) as 'June',
  Count(Case when Month(Date)=7 then Ride_id end) as 'July',
  Count(Case when Month(Date)=8 then Ride_id end) as 'August',
  count(Case when Month(Date)=9 then Ride_id end) as 'September',
  Count(Case when Month(Date)=10 then Ride_id end) as 'October',
  count(Case when Month(Date)=11 then Ride_id end) as 'November',
  Count(Case when Month(Date)=12 then Ride_id end) as 'December'
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
    req.body.Date +
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
      sql = `Select * from ride where Ride_id=${results.insertId}`
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
  let sql = 'select * from proposed_booking where Ride_id=42;'
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

app.post('/SetProposedBooking', jsonParser, function (req, res) {
  console.log(req.body)
  let sql =
    "update ride set Status='BOOKED' where Ride_id=" + req.body.Ride_id + ';'
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

app.post('/ViewPastRides', jsonParser, function (req, res) {
  console.log(req.body)
  let sql = 'select * from ride where Customer_Id=' + req.body.Customer_Id + ';'
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

app.post('/CurrentRide', jsonParser, function (req, res) {
  console.log(req.body)
  //SELECT * FROM ride WHERE Customer_Id = 302 ORDER BY Start_time LIMIT 1;
  let sql =
    'select * from ride where Customer_Id=' +
    req.body.Customer_Id +
    " and Status!='COMPLETED' order by Start_time limit 1;"
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

app.post('DriverCurrentRide', jsonParser, function (req, res) {
  console.log(req.body)
  //SELECT * FROM ride WHERE Driver_Id = 94 ORDER BY Start_time LIMIT 1;
  let sql =
    "select * from ride where Driver_Id=94 and Status!='COMPLETED' order by Start_time limit 1;"
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

app.post('/RideBookingTransaction', jsonParser, function (req, res) {
  console.log(req.body)
  /*
  Start Transaction ;
Select a.Location_Name,b.Location_Name,Type,sqrt(power((a.X_Coordinate-b.X_Coordinate),2)+power((a.Y_Coordinate-b.Y_Coordinate),2)) as Distance,
Case
	When Type='Go' Then 7.8*sqrt(power((a.X_Coordinate-b.X_Coordinate),2)+power((a.Y_Coordinate-b.Y_Coordinate),2))
    When Type='Prime' Then 10.6*sqrt(power((a.X_Coordinate-b.X_Coordinate),2)+power((a.Y_Coordinate-b.Y_Coordinate),2))
    When Type='XL' Then 14.5*sqrt(power((a.X_Coordinate-b.X_Coordinate),2)+power((a.Y_Coordinate-b.Y_Coordinate),2))
    When Type='Moto' Then 3.6*sqrt(power((a.X_Coordinate-b.X_Coordinate),2)+power((a.Y_Coordinate-b.Y_Coordinate),2))
    When Type='Lux' Then 20*sqrt(power((a.X_Coordinate-b.X_Coordinate),2)+power((a.Y_Coordinate-b.Y_Coordinate),2))
end as Cost
from vehicle
Join location a on a.Location_Name='Hauz Khas'
Join location b on b.Location_Name='IIIT Delhi'
group by Type;
Insert into ride(Customer_Id,Status,Date,Start_time,End_time,Payment_method,SourceName,DestinationName,Vehicle_Type) values(143,'REQUESTED','2023-02-21','04:22:21','05:22:01','Wallet','IIIT Delhi','Hauz Khas','Moto');
Commit;
*/
  let sql = 'Start Transaction ;'
  let sql1 =
    'Insert into ride(Customer_Id,Status,Date,Start_time,End_time,Payment_method,SourceName,DestinationName,Vehicle_Type) values(' +
    req.body.Customer_Id +
    ",'REQUESTED','" +
    req.body.Date +
    "','" +
    req.body.Start_time +
    "','" +
    req.body.End_Time +
    "','" +
    'Wallet' +
    "','" +
    req.body.SourceName +
    "','" +
    req.body.DestinationName +
    "','" +
    req.body.Vehicle_Type +
    "');"
  let sql3 = 'Commit;'
  connection.getConnection(function (err, connection) {
    connection.query(sql, function (error, results, fields) {
      if (error) {
        console.log(error)
      }
      console.log(sql)
      console.log(results)
      connection.query(sql1, function (error, results, fields) {
        if (error) {
          console.log(error)
        }
        console.log(sql1)
        console.log(results)
        connection.query(sql3, function (error, results, fields) {
          if (error) {
            console.log(error)
          }
          console.log(sql3)
          console.log(results)
          res.send(results)
        })
      })
      // res.send(results)
    })
  })
})

app.post('/CancelRideTransaction', jsonParser, function (req, res) {
  console.log(req.body)
  /*
  Start transaction;
set @cc=0;
set @cust=NULL;
set @driv=NULL;
Select @cc:=Cost,@cust:=Customer_Id,@driv:=Driver_Id from ride where ride_id=152;
delete from ride where Ride_id=152;
delete from proposed_booking where Ride_id=152;
Update customer set Wallet=Wallet-@cc*(10/100) where Customer_id=@cust;
Update driver set Earnings=Earnings+@cc*(10/100) where Driver_id=@driv;
Commit;
*/
  let sql = 'Start transaction;'
  let sql1 = 'set @cc=0;'
  let sql2 = 'set @cust=NULL;'
  let sql3 = 'set @driv=NULL;'
  let sql4 =
    'Select @cc:=Cost,@cust:=Customer_Id,@driv:=Driver_Id from ride where ride_id=' +
    req.body.Ride_id +
    ';'
  let sql5 = 'delete from ride where Ride_id=' + req.body.Ride_id + ';'
  let sql6 =
    'delete from proposed_booking where Ride_id=' + req.body.Ride_id + ';'
  let sql7 =
    'Update customer set Wallet=Wallet-@cc*(10/100) where Customer_id=@cust;'
  let sql8 =
    'Update driver set Earnings=Earnings+@cc*(10/100) where Driver_id=@driv;'
  let sql9 = 'Commit;'
  connection.getConnection(function (err, connection) {
    connection.query(sql, function (error, results, fields) {
      if (error) {
        console.log(error)
      }
      console.log(results)
      connection.query(sql1, function (error, results, fields) {
        if (error) {
          console.log(error)
        }
        console.log(results)
        connection.query(sql2, function (error, results, fields) {
          if (error) {
            console.log(error)
          }
          console.log(results)
          connection.query(sql3, function (error, results, fields) {
            if (error) {
              console.log(error)
            }
            console.log(results)
            connection.query(sql4, function (error, results, fields) {
              if (error) {
                console.log(error)
              }
              console.log(results)
              connection.query(sql5, function (error, results, fields) {
                if (error) {
                  console.log(error)
                }
                console.log(results)
                connection.query(sql6, function (error, results, fields) {
                  if (error) {
                    console.log(error)
                  }
                  console.log(results)
                  connection.query(sql7, function (error, results, fields) {
                    if (error) {
                      console.log(error)
                    }
                    console.log(results)
                    connection.query(sql8, function (error, results, fields) {
                      if (error) {
                        console.log(error)
                      }
                      console.log(results)
                      connection.query(sql9, function (error, results, fields) {
                        if (error) {
                          console.log(error)
                        }
                        console.log(results)
                        res.send(results)
                      })
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
  })
})

app.post('/AcceptRideTransaction', jsonParser, function (req, res) {
  console.log(req.body)
  /*
  Start Transaction;
Update Ride set Status='BOOKED' where Ride_Id=35;
Update ride set Driver_Id=93 where Ride_Id=35;
update ride set
Cost=
Case
	When Vehicle_Type='Go' Then 7.8*Distance
    When Vehicle_Type='Prime' Then 10.6*Distance
    When Vehicle_Type='XL' Then 14.5*Distance
    When Vehicle_Type='Moto' Then 3.6*Distance
    When Vehicle_Type='Lux' Then 20*Distance
end
where Ride_Id=35;
Commit;
*/
  let sql = 'Start Transaction;'
  let sql1 =
    'Update Ride set Status="BOOKED" where Ride_Id=' + req.body.Ride_id + ';'
  let sql2 =
    'Update ride set Driver_Id=94' + ' where Ride_Id=' + req.body.Ride_id + ';'
  let sql3 =
    'update ride set Cost=Case When Vehicle_Type="Go" Then 7.8*Distance When Vehicle_Type="Prime" Then 10.6*Distance When Vehicle_Type="XL" Then 14.5*Distance When Vehicle_Type="Moto" Then 3.6*Distance When Vehicle_Type="Lux" Then 20*Distance end where Ride_Id=' +
    req.body.Ride_id +
    ';'
  let sql4 = 'Commit;'
  connection.getConnection(function (err, connection) {
    connection.query(sql, function (error, results, fields) {
      if (error) {
        console.log(error)
      }
      console.log(results)
      connection.query(sql1, function (error, results, fields) {
        if (error) {
          console.log(error)
        }
        console.log(results)
        connection.query(sql2, function (error, results, fields) {
          if (error) {
            console.log(error)
          }
          console.log(results)
          connection.query(sql3, function (error, results, fields) {
            if (error) {
              console.log(error)
            }
            console.log(results)
            connection.query(sql4, function (error, results, fields) {
              if (error) {
                console.log(error)
              }
              console.log(results)
              res.send(results)
            })
          })
        })
      })
    })
  })
})

app.post('/ApplyCouponTransaction', jsonParser, function (req, res) {
  console.log(req.body)
  /*

Start Transaction;
SET @max_copoun=0;
SET @c_code=NULL;
Select @max_copoun:=max(Discount_percent),@c_code:=Coupon_ID from coupons where Customer_ID=275 and curdate()<coupons.Expiry_Date
group by Coupon_ID;
Update Ride set Coupon_code=@c_code where Ride_id=2;
Delete from coupons where Coupon_ID=@c_code;
Update ride 
inner join (
Select coupons.Discount_percent as d from ride
join coupons on coupons.Customer_ID=ride.Customer_id where ride.Ride_id=70) t1
On ride.Ride_id=70
set Cost= ((100-t1.d)/100)*
Case
	When Vehicle_Type='Go' Then Distance*7.8
    When Vehicle_Type='Prime' Then Distance*10.6
    When Vehicle_Type='Moto' Then Distance*3.6
    When Vehicle_Type='XL' Then Distance*14.5
	When Vehicle_Type='Lux' Then Distance*20
End
where Ride_id=70 And Coupon_Code is not null;
Commit;
*/
  let sql = 'Start Transaction;'
  let sql1 = 'SET @max_copoun=0;'
  let sql2 = 'SET @c_code=NULL;'
  let sql3 =
    'Select @max_copoun:=max(Discount_percent),@c_code:=Coupon_ID from coupons where Customer_ID=' +
    req.body.Customer_id +
    ' and curdate()<coupons.Expiry_Date group by Coupon_ID;'
  let sql4 =
    'Update Ride set Coupon_code=@c_code where Ride_id=' +
    req.body.Ride_id +
    ';'
  let sql5 =
    'Update ride inner join (Select coupons.Discount_percent as d from ride join coupons on coupons.Customer_ID=ride.Customer_id where ride.Ride_id=' +
    req.body.Ride_id +
    ') t1 On ride.Ride_id=' +
    req.body.Ride_id +
    ' set Cost= ((100-t1.d)/100)* Case When Vehicle_Type="Go" Then Distance*7.8 When Vehicle_Type="Prime" Then Distance*10.6 When Vehicle_Type="Moto" Then Distance*3.6 When Vehicle_Type="XL" Then Distance*14.5 When Vehicle_Type="Lux" Then Distance*20 End where Ride_id=' +
    req.body.Ride_id +
    ' And Coupon_Code is not null;'
  let sql6 =
    'Delete from coupons where Coupon_ID=@c_code and Customer_ID=' +
    req.body.Customer_id +
    ';'
  let sql7 = 'Commit;'
  connection.getConnection(function (err, connection) {
    connection.query(sql, function (error, results, fields) {
      if (error) {
        console.log(error)
      }
      console.log(sql)
      console.log(results)
      connection.query(sql1, function (error, results, fields) {
        if (error) {
          console.log(error)
        }
        console.log(sql1)
        console.log(results)
        connection.query(sql2, function (error, results, fields) {
          if (error) {
            console.log(error)
          }
          console.log(sql2)
          console.log(results)
          connection.query(sql3, function (error, results, fields) {
            if (error) {
              console.log(error)
            }
            console.log(sql3)
            console.log(results)
            connection.query(sql4, function (error, results, fields) {
              if (error) {
                console.log(error)
              }
              console.log(sql4)
              console.log(results)
              connection.query(sql5, function (error, results, fields) {
                if (error) {
                  console.log(error)
                }
                console.log(sql5)
                console.log(results)
                connection.query(sql6, function (error, results, fields) {
                  if (error) {
                    console.log(error)
                  }
                  console.log(sql6)
                  console.log(results)
                  connection.query(sql7, function (error, results, fields) {
                    if (error) {
                      console.log(error)
                    }
                    console.log(sql7)
                    console.log(results)
                    res.send(results)
                  })
                })
              })
            })
          })
        })
      })
    })
  })
})

app.post('/RideCompletionTransaction', jsonParser, function (req, res) {
  console.log(req.body)
  /*
Start Transaction;
Update customer
join ride on Ride.Customer_Id=customer.Customer_id set Wallet=Wallet-Ride.Cost where customer.Customer_id=275;
Update driver
join ride on Ride.Driver_Id=driver.Driver_id set Earnings=Earnings+Ride.Cost where driver.Driver_id=30;
Update customer
join ride on Ride.Customer_Id=customer.Customer_id set Rating=(Rating*No_of_Trips+4.0)/(No_of_Trips+1) where customer.Customer_id=275;
Update driver
join ride on Ride.Driver_Id=driver.Driver_id set Rating=(Rating*No_of_Trips+4.0)/(No_of_Trips+1) where driver.Driver_id=30;
Update customer
join ride on Ride.Customer_Id=customer.Customer_id set No_of_Trips=No_of_Trips+1 where customer.Customer_id=275;
Update driver
join ride on Ride.Driver_Id=driver.Driver_id set No_of_Trips=No_of_Trips+1 where driver.Driver_id=30;
Update ride set Status='COMPLETED' where ride_id=230
Commit;
*/
  let sql = 'Start Transaction;'
  let sql1 =
    'Update customer join ride on Ride.Customer_Id=customer.Customer_id set Wallet=Wallet-Ride.Cost where customer.Customer_id=' +
    req.body.Customer_id +
    ';'
  let sql2 =
    'Update driver join ride on Ride.Driver_Id=driver.Driver_id set Earnings=Earnings+Ride.Cost where driver.Driver_id=' +
    req.body.Driver_id +
    ';'
  let sql3 =
    'Update customer join ride on Ride.Customer_Id=customer.Customer_id set Rating=(Rating*No_of_Trips+4.0)/(No_of_Trips+1) where customer.Customer_id=' +
    req.body.Customer_id +
    ';'
  let sql4 =
    'Update driver join ride on Ride.Driver_Id=driver.Driver_id set Rating=(Rating*No_of_Trips+4.0)/(No_of_Trips+1) where driver.Driver_id=' +
    req.body.Driver_id +
    ';'
  let sql5 =
    'Update customer join ride on Ride.Customer_Id=customer.Customer_id set No_of_Trips=No_of_Trips+1 where customer.Customer_id=' +
    req.body.Customer_id +
    ';'
  let sql6 =
    'Update driver join ride on Ride.Driver_Id=driver.Driver_id set No_of_Trips=No_of_Trips+1 where driver.Driver_id=' +
    req.body.Driver_id +
    ';'
  let sql7 =  'Update ride set Status="COMPLETED" where ride_id=' + req.body.Ride_id + ';'
  let sql8 = 'Commit;'
  connection.getConnection(function (err, connection) {
    connection.query(sql, function (error, results, fields) {
      if (error) {
        console.log(error)
      }
      console.log(sql)
      console.log(results)
      connection.query(sql1, function (error, results, fields) {
        if (error) {
          console.log(error)
        }
        console.log(sql1)
        console.log(results)
        connection.query(sql2, function (error, results, fields) {
          if (error) {
            console.log(error)
          }
          console.log(sql2)
          console.log(results)
          connection.query(sql3, function (error, results, fields) {
            if (error) {
              console.log(error)
            }
            console.log(sql3)
            console.log(results)
            connection.query(sql4, function (error, results, fields) {
              if (error) {
                console.log(error)
              }
              console.log(sql4)
              console.log(results)
              connection.query(sql5, function (error, results, fields) {
                if (error) {
                  console.log(error)
                }
                console.log(sql5)
                console.log(results)
                connection.query(sql6, function (error, results, fields) {
                  if (error) {
                    console.log(error)
                  }
                  console.log(sql6)
                  console.log(results)
                  connection.query(sql7, function (error, results, fields) {
                    if (error) {
                      console.log(error)
                    }
                    console.log(sql7)
                    console.log(results)
                    connection.query(sql8, function (error, results, fields) {
                      if (error) {
                        console.log(error)
                      }
                      console.log(sql8)
                      console.log(results)
                      res.send(results)
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
  })
})

// Starting our server.
app.listen(3000, () => {})
