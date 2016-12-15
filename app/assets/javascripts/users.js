/* global $, Stripe */
$(document).on('turbolinks:load', function(){
    var theForm = $('#pro_form');
    var submitBtn = $('#form-submit-btn');
    
    Stripe.setPublishableKey($('meta[name="stripe-key"]').attr('content'));
    
    submitBtn.click(function(event){

        event.preventDefault();
        submitBtn.val("Processing").prop('disabled', true);
        
        var ccNum = $('#card_number').val();
        var cvcNum = $('#card_code').val();
        var expMonth = $('#card_month').val();
        var expYear = $('#card_year').val();
        var error = false;
    
    if(!Stripe.card.ValidateCardNumber(ccNum)){
        error = true;
        alert('Invalid Credit Number');
    }
    
    if(!Stripe.card.ValidateCVC(cvcNum)){
        error = true;
        alert('Invalid CVC Number');
    }
    
    if(!Stripe.card.ValidateExpiry(expMonth, expYear)){
        error = true;
        alert('Invalid Expiration Date');
    }
    
    if(error){
        
        submitBtn.prop('disabled', false).val("Sign Up");
        
    } else {
        
        Stripe.createToken({
        number: ccNum, 
        cvc: cvcNum,
        exp_month: expMonth,
        exp_year: expYear
    }, stripeResponseHandler);
        
    }
    
    return false;
    
    });
    
    function stripeResponseHandler(status, response){
        var token = response.id;
        theForm.append($('<input type="hidden" name="user[stripe_card_token]">').val(token));
        theForm.get(0).submit();
    }
    
});