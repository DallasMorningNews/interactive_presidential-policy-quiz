$(document).ready(function(){function n(n,t){$.each(a,function(e,i){if(t===i.cat){var a=e;$("#"+t).find("h4").text("For "+c[n]+": "+i.questions[n].question);var s=_.shuffle(i.questions[n].answer_group);$.each(s,function(n,o){$("#"+t).find(".answer-block").append("<li>"+s[n]+"</li>")}),$("#"+t).find(".answer-block li").bind("click",function(){var e=$(this).text();$(this).addClass("selected"),$("#"+t).find(".answer-block li").unbind("click"),o(a,n,e)})}})}function o(n,o,e){console.log(n,o,e);var i=a[n].cat;e===a[n].questions[o].correct_answer?($("<p><span class='right-wrong'>Right. </span>"+_.capitalize(c[o])+" to your candidate.</p>").insertBefore($("#"+i+" .read-more")),p["q"+(n+1)]=o+1,p.total+=o+1,$.post("http://apps.dallasnews.com/livewire/presidential-policy-quiz/update/"+s,p,function(){console.log("Success!")}).fail(function(){console.log("Whoops, something bad happened!")}).done(function(n){t(n)})):$("<p><span class='right-wrong'>That’s incorrect. </span> The right answer is: "+a[n].questions[o].correct_answer+"</p>").insertBefore($("#"+i+" .read-more")),$("#"+i).find(".read-more").removeClass("no-show")}function t(n){l=0,r=0,d=0,u=0,$.each(n,function(n,o){"Hillary Clinton"===o.candidate?(l++,d+=o.total):"Donald Trump"===o.candidate&&(r++,u+=o.total)}),console.log(l,d,r,u)}var e=new Date,i=e.getFullYear();$(".copyright").text(i);var a,s,c=["one point","two points","three points"],l=0,r=0,d=0,u=0;$.getJSON("js/data.json",function(n){a=n});var p={candidate:"",q1:0,q2:0,q3:0,q4:0,total:0};$(".candidate-mug").bind("click",function(){p.candidate=$(this).attr("alt"),$("#questions").slideDown(500),$.post("http://apps.dallasnews.com/livewire/presidential-policy-quiz",p,function(){console.log("Success!")}).fail(function(){console.log("Whoops, something bad happened!")}).done(function(n){console.log(n),s=n.id}),$(".candidate-mug").unbind("click")}),$(".point-values li").click(function(){$(this).parent("ul").addClass("no-show");var o=$(this).index(),t=$(this).closest(".question-block").attr("id");n(o,t)})});
//# sourceMappingURL=scripts-bundle.js.map
