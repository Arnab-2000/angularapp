import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginData={
    username:'',
    password:''
  }
  constructor(private snack: MatSnackBar, private login:LoginService, private router: Router) { }

  ngOnInit(): void {
  }

  formSubmit(){
    console.log('login button clicked');
    if(this.loginData.username.trim() == '' || this.loginData.username == null)
    {

      this.snack.open('Username is required','',{
        duration:3000
      });

      return;
    }


    if(this.loginData.password.trim() == '' || this.loginData.password == null)
    {

      this.snack.open('Password is required','',{
        duration:3000
      });

      return;
    }

    //request to server to generate token
    this.login.generateToken(this.loginData).subscribe(
      (data: any)=>{
        console.log('Success');
        console.log(data);

        this.login.loginUser(data.token);

        this.login.getCurrentUser().subscribe(

          (user: any)=>{
            this.login.setUser(user);
            console.log(user);

            //redirect to Admin DashBoard if the role is Admin
                            //Or
            //redirect to Normal User Dashboard if the role is Normal

            if(this.login.getUserRole() == "Admin")
            {
              //admin-dashboard
              //window.location.href="/admin"
              this.router.navigate(['admin']);
              this.login.loginStatus.next(true);
            }
            else if(this.login.getUserRole() == "Normal")
            {
               //window.location.href="/user-dashboard"
              this.router.navigate(['user-dashboard']);
              this.login.loginStatus.next(true);

            }
            else
            {
              this.login.logout();

            }


            
          }
        )



      },
      (error)=>{
        this.snack.open("Invalid Credentials !! Try Again",'',{
          duration:3000
        })
        console.log('Erorr!');
        console.log(error);
        
        
      }
    )
  }
}
