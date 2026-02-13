import Navbar from "@/components/ui/Navbar";
import Sidebar from "@/components/ui/Sidebar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Table from "@/components/ui/Table";
import Modal from "@/components/ui/Modal";
import Chart from "@/components/ui/Chart";
import Section from "@/components/ui/Section";
import Page from "@/components/ui/Page";
import Main from "@/components/ui/Main";

export const ComponentRegistry = {
  Navbar,
  Sidebar,
  Card,
  Button,
  Input,
  Table,
  Modal,
  Chart,
  Page,
  Section,
  Main
};

export const AllowedComponents = Object.keys(ComponentRegistry);
