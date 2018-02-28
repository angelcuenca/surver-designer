function customerspopup(){
    $("#CustomersModal").modal();
}

function fetchcustomers(){
    console.log('Retrieving data...');
    var customername=$("#txt_customer_name").val();
    console.log(customername);
    var stringurl = "https://vrsdev.sanmina.com:8443/apis_dev/api/v1/pat/customers/"+customername+"/search";
    console.log(stringurl);
    $.ajax({
        type:'GET',
        url: stringurl,
        dataType:'json',
        success:function(data,status){
            var content="";
            for(var i=0;i<data.length;i++){
                content+="<tr><td style='width:12%;'>"+data[i].masterCustomerName+"</td>"+
                         "<td style='width:23%;'>"+data[i].customerName+"</td>"+
                         "<td style='width:10%;'><button type='button' class='btn btn-success' onclick=''>Add Customer</button></td></tr>";
                                                //"<td style='width:23%'><button>Add</button></td></tr>";
            }
            $("#customerscontent").empty();
            $("#customerscontent").append(content);

        },
        error:function(xhr,status,errorThrown){
                console.log(xhr);
                console.log(status);
                console.log(errorThrown);
        }
    });
}