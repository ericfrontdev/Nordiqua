import { Request, Response } from 'express';
import { ClientService } from '../services/client.service';

export class ClientController {
  private clientService: ClientService;

  constructor() {
    this.clientService = new ClientService();
  }

  getClients = async (req: Request, res: Response) => {
    try {
      const clients = await this.clientService.getAll();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching clients' });
    }
  };

  getClientById = async (req: Request, res: Response) => {
    try {
      const client = await this.clientService.getById(req.params.id);
      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }
      res.json(client);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching client' });
    }
  };

  createClient = async (req: Request, res: Response) => {
    try {
      const client = await this.clientService.create(req.body);
      res.status(201).json(client);
    } catch (error) {
      res.status(400).json({ message: 'Error creating client' });
    }
  };

  updateClient = async (req: Request, res: Response) => {
    try {
      const client = await this.clientService.update(req.params.id, req.body);
      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }
      res.json(client);
    } catch (error) {
      res.status(400).json({ message: 'Error updating client' });
    }
  };

  deleteClient = async (req: Request, res: Response) => {
    try {
      await this.clientService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting client' });
    }
  };
}