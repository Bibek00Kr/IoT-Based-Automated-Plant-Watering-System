# 🌿 IoT-Based Automated Plant Watering System

An intelligent smart garden solution powered by **ESP8266** and the **Blynk IoT Cloud**. This system monitors soil moisture and automates the watering and fertilizing of your plants. Complete with a custom **responsive web dashboard** that allows real-time interaction and control — right from your browser!

---

## 🔧 Project Overview

This project automates plant care by:

- Measuring **soil moisture** via a sensor connected to an ESP8266.
- Automatically activating a **water pump** or **fertilizer pump** when needed.
- Displaying real-time data on a beautifully designed **web interface**.
- Allowing **manual control** through the dashboard with one tap.

It’s perfect for busy plant parents or anyone exploring the magic of **IoT + Web Development**.

## 🧠 Tech Stack

| Layer        | Tools Used                                      |
|--------------|-------------------------------------------------|
| Hardware     | **ESP8266**, Soil Moisture Sensor, Relay, Pump  |
| Firmware     | Arduino (.ino sketch) + Blynk Auth Token        |
| Cloud        | **Blynk IoT Cloud API (v1)**                    |
| Frontend     | HTML, CSS, JavaScript (Vanilla)                 |

---

## 📂 Project Structure

```bash
📁 plant-watering-system/
├── index.html           # Responsive UI for dashboard and plant selection
├── styles.css           # Aesthetic styling for mobile + desktop
├── app.js               # JS logic to interact with Blynk API and UI
├── IoT_Automatic3Plant.ino  # Firmware code for ESP8266
