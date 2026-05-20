1. The dApp Architecture (Solidity + HTML + JS)
Solidity (.sol): Donations made via the “Donate” button are added to the total donation budget(at the same time emitted.).Additionaly with getBalance function you can get totalDonations information.

HTML (.html): The frontend skeleton. Making our frontend.

JavaScript (.js): The bridge. Using window.onload, JS triggers instantly when the page loads, fetches the Solidity data.