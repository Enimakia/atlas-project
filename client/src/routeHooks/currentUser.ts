import {useUser} from "@clerk/clerk-react"


export const CurrentUser = () => {
const {user} = useUser()


console.log(user);

  

  // getting the user from the localstorage

  //const user = localStorage.getItem('user')

  // if(!user){
  //   localStorage.setItem("user",)
  // }

}
