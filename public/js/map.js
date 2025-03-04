
document.addEventListener("DOMContentLoaded",function(){
mapboxgl.accessToken=mapToken;
const map=new mapboxgl.Map({
  container:'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  //center:listing.geometry.coordinates,
  center:listing.geometry.coordinates,
  zoom:9,
  });
  const marker = new mapboxgl.Marker({color:"red"})
  //.setLngLat([12.554729, 55.70651])//listing.geometry.coordinates
  .setLngLat(listing.geometry.coordinates)
  .setPopup(new mapboxgl.Popup({ offset:25 })
  .setHTML(`<h4>${listing.location}</h4><p>Exact location will be provided after booking</p>`))
  .addTo(map);
});


  
  





// document.addEventListener("DOMContentLoaded",function(){
//   mapboxgl.accessToken=mapToken;
//   const lng=-74.006;
//   const lat=40.7128;
//  const map=new mapboxgl.Map({
// container:'map',
// style: 'mapbox://styles/mapbox/streets-v11',
// //center:listing.geometry.coordinates,
// center:[lng,lat],
// zoom:9,
// });
// new mapboxgl.Marker({color:'red'})
// .seLngLat([lng,lat])
// .addTo(map);
// });




























