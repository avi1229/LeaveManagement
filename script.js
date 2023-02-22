
 function sendEmail(m,eto,s) {

  Email.send({
    Host : "smtp.elasticemail.com",
    Username : "classjoining123@gmail.com",
    Password : "D144649B11B11C83CE105D1EEBE27467CAC0",
    To : eto,
    From : "classjoining123@gmail.com",
    Subject : s,
    Body : m,
  }).then(function (message) {
    alert("mail sent successfully")
  });
}

 function ujson(i,st){
     fetch('/reqs/'+i+'/'+st+'/', {
        method:"post",
        headers: {
          'Content-Type': 'application/json'
        }
    });
}
 function approval(i,em){
    console.log(em)
    id1="tab-"+i
    console.log("Approval")
    document.getElementById(id1).remove();
    var m ="Hey Your Leave Request is Approved !!!!!"
    var s="Leave Request Response"
    var st="Your Request for leave has been approved by Admin."
    sendEmail(m,em,s);
   ujson(i,st);
      
   
}
function denial(i,em){
    console.log("Denial")
    id1="tab-"+i
    document.getElementById(id1).remove();
    var m ="Sorry Your Leave Request is Rejected !!!!!"
    var s="Leave Request Response"
    var st="Your Request for leave has been denied by Admin."
    sendEmail(m,em,s);
   ujson(i,st);
}
function onhold(i,em){
    console.log("On hold ")
    id1="hold"+i
    id2="tab-"+i
    document.getElementById(id1).remove();
    document.getElementById(id2).style.backgroundColor="#FCF482";
    var m ="Your Leave Request is Kept on Hold Please wait for further Response...."
    var s="Leave Request Response"
    var st="Your Request for leave has been kept on hold by Admin.Kindly wait for further response"
    sendEmail(m,em,s);
   ujson(i,st);
}

function track(){
    var tid=document.getElementById("tid").value;
    tid=parseInt(tid);
    fetch('/reqs')
    .then(response => response.json())
    .then(data => { 
    for(i=0;i<data.length;i++){
        k=parseInt(data[i].trackid)
        if(data[i].trackid===tid){
            document.getElementById("res").innerHTML=data[i].status;
            break
        }
    }
    
    });

}
function req(){ 
    fetch('/reqs')
    .then(response => response.json())
    .then(data => {
      console.log(data); 
      var tab=document.getElementById("datatb");
    var but=document.getElementById("bt");
    console.log(data);
    but.remove();
    for (i=0;i<data.length;i++){
        var em=data[i].email;
        var row = `<div class="each" id="tab-${i}">
            <table >
            <tbody>
            <tr>
                <td><b>Name:</b></td>
                <td>${data[i].Uname}</td>
            </tr>
            
            <tr>
            <td><b>Email:</b></td>
            <td>${data[i].email}</td>
            <tr>
            <td><b>Start Date :</b></td>
            <td>${data[i].stdt}</td>
            <tr>
            <td><b>End date :</b></td>
            <td>${data[i].enddt}</td>
            <tr>
            <td><b>Type Of Leave :</b></td>
            <td>${data[i].type}</td>
            <tr>
            <td><b>Reason :</b></td>
            <td>${data[i].reason}</td>
            <tr>
            <td><b>Applied On :</b></td>
                    <td>${data[i].date}</td>
                </tr>
            </tbody>
            
        </table>
        <button id="accept" onclick="approval(${i},'${em}')"><b>Approve</b></button>&nbsp;&nbsp;&nbsp;<button class="hold" id="hold${i}" onclick="onhold(${i},'${em}')"><b>Hold</b></button>&nbsp;&nbsp;&nbsp;<button id="deny" onclick="denial(${i},'${em}')"><b>Deny</b></button>
       
        <br/>
    </div>
    
        `
        tab.innerHTML+=row;
    }    
    

    })
    .catch(error => console.error(error));
    
        }

 
        function getleaves(ema){ 
            fetch('/reqs')
            .then(response => response.json())
            .then(data => {
              console.log(data); 
              var tab=document.getElementById("ldata");
            var myem=ema;
            var c=0;
            for (i=0;i<data.length;i++){
                var em=data[i].email;
                
                console.log(myem,em)
                if(myem===em){
                        c+=1;
                var row = `<div class="each">
                    <table >
                    <tbody>
                    
                    <td><b>Start Date :</b></td>
                    <td>${data[i].stdt}</td>
                    <tr>
                    <td><b>End date :</b></td>
                    <td>${data[i].enddt}</td>
                    <tr>
                    <td><b>Type Of Leave :</b></td>
                    <td>${data[i].type}</td>
                    <tr>
                    <td><b>Reason :</b></td>
                    <td>${data[i].reason}</td>
                    <tr>
                    <td><b>Applied On :</b></td>
                            <td>${data[i].date}</td>
                        </tr>
                        <tr>
                    <td><b>Status :</b></td>
                            <td>${data[i].status}</td>
                        </tr>
                    </tbody>
                </table>

            </div>
                `
                tab.innerHTML+=row;
            }    
        }
        if(c==0){
            tab.innerHTML=`<center><h2>No Leaves Applied</h2></center>`
        }
        
            })
            .catch(error => console.error(error));
            
                }
        