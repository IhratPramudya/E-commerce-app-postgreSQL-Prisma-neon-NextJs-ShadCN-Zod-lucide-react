"use client";

import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MinusCircle, PlusCircle, Trash2, ShoppingBag, XCircle } from "lucide-react";
import { useRouter } from "next/router";
import { CartItem } from "@/types";
import { getMyCart } from "@/lib/actions/cart.actions";

export interface CartItem {
    id: string
}