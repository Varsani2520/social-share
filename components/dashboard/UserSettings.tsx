"use client";
import React, { useState, useEffect } from "react";
import ImageForm from "./ImageForm";
import { CloudUpload, ImageIcon, Palette } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { UserProfile } from "@/actions/UserProfile";
import { toast } from "sonner";
import DashboardSectionComponent from "./DashboardSectionComponent";
import UserSocialForm from "./UserSocialForm";

const toastOptions = {
  id: 0,
  duration: 1500,
};

function UserSettings({ user, session }: any) {
  const [bgType, setBgType] = useState(user.bgType);
  const [bgColor, setBgColor] = useState(user.bgColor);
  const [bgImage, setBgImage] = useState(user.bgImage);
  const [avatarImage, setAvatarImage] = useState(
    user.avatarImage || session?.user?.image
  );
  const [prevState, setPrevState] = useState(user); // save state to check for changes

  useEffect(() => {
    setBgType(user.bgType);
    setBgColor(user.bgColor);
    setBgImage(user.bgImage);
  }, [user]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set("bgType", bgType);
    formData.set("bgColor", bgColor);
    formData.set("bgImage", bgImage); // Set the bgImage in formData
    formData.set("avatarImage", avatarImage);

    const currentState = [...formData.entries()];

    // compare form values with previous state
    const hasChanged = currentState.some(
      ([key, value]) => prevState[key] !== value
    );

    // no changes
    if (!hasChanged) {
      toast.info("Nothing to save", toastOptions);
      return;
    }

    try {
      const result = await UserProfile(formData);
      console.log(result);

      if (result.success) {
        toast.success(result.message);
        setPrevState(Object.fromEntries(currentState));
      } else toast.error(result.message);
    } catch (error: any) {
      console.error("Error saving user profile:", error);
      toast.error(error?.message);
    }
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const data = new FormData();
      data.set("file", file);
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: data,
        });
        const result = await res.json();

        // success
        if (result.link) toast.success("Image uploaded. Please save details");
        //error
        else toast.error("Failed to upload image");

        setAvatarImage(result.link);
      } catch (error) {
        console.error("Error uploading avatar:", error);
      }
    }
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const data = new FormData();
      data.set("file", file);
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: data,
        });
        const result = await res.json();

        // success
        if (result.link) toast.success("Image uploaded. Please save details");
        //error
        else toast.error("Failed to upload image");

        setBgImage(result.link);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  }

  const style =
    bgType === "color"
      ? { backgroundColor: bgColor }
      : { backgroundImage: `url(${bgImage})` };

  return (
    <DashboardSectionComponent>
      <form onSubmit={handleSubmit}>
        <div
          className="rounded-t-3xl -mt-1 min-h-[250px] py-5 flex justify-center items-center bg-cover bg-center"
          style={style}
        >
          <div>
            <ImageForm
              defaultValue={bgType}
              options={[
                { name: "color", icon: <Palette />, label: "Color" },
                { name: "image", icon: <ImageIcon />, label: "Image" },
              ]}
              onChange={(newBgType: React.SetStateAction<string>) =>
                setBgType(newBgType)
              }
            />
            {bgType === "color" && (
              <div className="flex justify-center mt-2 bg-gray-900 shadow shadow-white px-4 py-2 rounded-full">
                <span className="text-white">Background Color :</span>
                <input
                  type="color"
                  name="bgColor"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                />
              </div>
            )}
            {bgType === "image" && (
              <div className="flex justify-center mt-1">
                <label className="bg-white text-black py-3 px-3 rounded-full flex items-center">
                  <CloudUpload className="mr-2" /> Change Image
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-center">
          <div className="relative  -top-10">
            <Image
              className="rounded-full h-32 w-32 items-center bg-cover bg-center  border-gray-900 border-4 shadow-white/50 shadow"
              src={avatarImage}
              width={130}
              height={130}
              alt="avatar"
            />
            <label className="absolute bottom-0 right-0 bg-black border  p-2 rounded-full">
              <CloudUpload />
              <input
                type="file"
                className="hidden"
                onChange={handleAvatarChange}
              ></input>
            </label>
          </div>
        </div>
        <div className="m-10 -mt-1 space-y-6">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              type="text"
              className="bg-transparent"
              id="displayName"
              name="displayName"
              placeholder="John Doe"
              defaultValue={user.displayName}
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="location">Location</Label>
            <Input
              type="text"
              className="bg-transparent"
              id="location"
              name="location"
              placeholder="Location that you want to display to the world"
              defaultValue={user.location}
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              className="bg-transparent"
              placeholder="Type your bio / message here."
              defaultValue={user.bio}
              name="bio"
              id="bio"
            />
          </div>
          <div className="flex justify-center mb-5">
            <Button type="submit" className="border">
              Save Details
            </Button>
          </div>
        </div>
      </form>
    </DashboardSectionComponent>
  );
}

export default UserSettings;
