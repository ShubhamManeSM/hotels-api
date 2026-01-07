const express = require("express");
const app = express();
const cors = require("cors")
const { initializeDatabase } = require("./db/db.connect");
const Hotel = require("./models/hotels.models");
require("dotenv").config();

const corsOption = {
  origin: "*",
  credentials: true
}

app.use(cors(corsOption))
app.use(express.json());
initializeDatabase();

async function createHotel(newHotel){
  try{
    const hotel = new Hotel(newHotel)
    const saveHotel = await hotel.save()
    return saveHotel
  }catch(error){
    throw error
  }
}

app.post("/hotels", async (req,res) => {
  try {
    const savedHotel = await createHotel(req.body)
    res.status(201).json({message: "Hotel added successfully", hotel: savedHotel})
  } catch (error) {
    res.status(500).json({error: "Failed to add hotel"})
  }
})

async function getAllHotels() {
  try {
    const allHotels = await Hotel.find();
    return allHotels;
  } catch (error) {
    throw error;
  }
}

app.get("/hotels", async (req, res) => {
  try {
    const hotels = await getAllHotels();
    if (hotels.length != 0) {
      res.json(hotels);
    } else {
      res.status(404).json({ error: "No hotels found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotels" });
  }
});


async function getHotelByName(hotelName) {
  try {
    const hotels = await Hotel.find({ name: hotelName });
    return hotels;
  } catch (error) {
    throw error;
  }
}

app.get("/hotels/:hotelName", async (req, res) => {
  try {
    const hotels = await getHotelByName(req.params.hotelName);
    if (hotels.length != 0) {
      res.json(hotels);
    } else {
      res.status(404).json({ error: "No hotel found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotel" });
  }
});

async function getHotelByPhoneNumber(phoneNumber) {
  try {
    const hotels = await Hotel.find({ phoneNumber });
    return hotels;
  } catch (error) {
    throw error;
  }
}

app.get("/hotels/directory/:phoneNumber", async (req, res) => {
  try {
    const hotels = await getHotelByPhoneNumber(req.params.phoneNumber);
    if (hotels.length != 0) {
      res.json(hotels);
    } else {
      res.status(404).json({ error: "No hotel found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotel" });
  }
});

async function getHotelsByRating(hotelRating) {
  try {
    const hotels = await Hotel.find({ rating: hotelRating });
    return hotels;
  } catch (error) {
    throw error;
  }
}

app.get("/hotels/rating/:hotelRating", async (req, res) => {
  try {
    const hotels = await getHotelsByRating(req.params.hotelRating);
    if (hotels.length != 0) {
      res.json(hotels);
    } else {
      res.status(404).json({ error: "No hotel found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotel" });
  }
});

async function getHotelsByCategory(hotelCategory) {
  try {
    const hotels = await Hotel.find({ category: hotelCategory });
    return hotels;
  } catch (error) {
    throw error;
  }
}

app.get("/hotels/category/:hotelCategory", async (req, res) => {
  try {
    const hotels = await getHotelsByCategory(req.params.hotelCategory);
    if (hotels.length != 0) {
      res.json(hotels);
    } else {
      res.status(404).json({ error: "No hotel found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotel" });
  }
});

async function deleteHotel(hotelId) {
  try {
    const deletedHotel = await Hotel.findByIdAndDelete(hotelId)
    return deletedHotel;
  } catch (error) {
    console.log(error)
  }
}

app.delete("/hotels/:hotelId", async(req,res) => {
  try {
    const deletedHotel = await deleteHotel(req.params.hotelId)
    if(deletedHotel){
      res.status(200).json({message: "Hotel deleted successfully"})
    }
  } catch (error) {
    res.status(500).json({error: "Failed to delete hotel."})
  }
})

async function updateHotel(hotelId,dataToUpdate) {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(hotelId,dataToUpdate,{
      new: true,
    })
    return updatedHotel;
  } catch (error) {
    console.log("Error in updating hotel rating", error);
  }
}

app.post("/hotels/:hotelId", async(req,res) => {
  try {
    const updatedHotel = await updateHotel(req.params.hotelId, req.body)
    if(updatedHotel){
      res.status(200).json({message: "Hotel Rating updated successfully", updatedHotel})
    }else{
      res.status(404).json({error: "Hotel not found"})
    }
  } catch (error) {
    res.status(500).json({error: "Failed to update hotel."})
  }
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
