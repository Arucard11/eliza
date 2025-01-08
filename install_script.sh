#!/bin/bash

# This script automates the installation of NVM, Node.js, NPM, PNPM, XRDP, Ubuntu GNOME, and then clones and builds the 'eliza' repository.

# Step 1: Install NVM v0.40.1
echo "Installing NVM v0.40.1..."
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# Step 2: Source bashrc to make NVM available in the current session
echo "Sourcing bashrc..."
source ~/.bashrc

# Step 3: Install Node.js v23 using NVM
echo "Installing Node.js v23..."
nvm install 23

# Step 4: Install the latest version of NPM
echo "Installing the latest NPM..."
npm install -g npm@latest

# Step 5: Install the latest version of PNPM
echo "Installing the latest PNPM..."
npm install -g pnpm

# Step 6: Install XRDP (for remote desktop access)
echo "Installing XRDP..."
sudo apt update
sudo apt install -y xrdp

# Step 7: Install Ubuntu GNOME (if it's not already installed)
echo "Installing Ubuntu GNOME..."
sudo apt install -y ubuntu-gnome-desktop

# Step 8: Set the password for the Ubuntu user (you can change this later)
echo "Setting the password for the Ubuntu user..."
echo "ubuntu:ubuntu" | sudo chpasswd

# Step 9: Clone the 'eliza' repository
echo "Cloning the eliza repository..."
git clone https://github.com/Arucard11/eliza.git

# Step 10: Change into the 'eliza' directory
echo "Changing directory to 'eliza'..."
cd eliza

# Step 11: Install dependencies using PNPM
echo "Installing dependencies with PNPM..."
pnpm install

# Step 12: Build the project using PNPM
echo "Building the project with PNPM..."
pnpm build

# Finish
echo "Script completed successfully!"
